import fs from "fs";

import { cartesian } from "./utils/common";
import { search } from "./utils/graph";

type Scan = {
  valveLookup: Map<string, Valve>;
  distanceLookup: Map<string, Map<string, number>>;
  openLookup: Map<string, number>;
};

type Valve = {
  name: string;
  flowRate: number;
  neighbors: string[];
};

type Context = {
  locations: string[];
  times: number[];
  actions: Action[];
  valveLookup: Map<string, Valve>;
  distanceLookup: Map<string, Map<string, number>>;
  openLookup: Map<string, number>;
};

type Action = {
  moves: Move[];
  possibleMoves: Move[][];
};

type Move = {
  actor: number;
  from: string;
  to: string;
};

const START_VALVE = "AA";

function parseInput(): Scan {
  const valveLookup = fs
    .readFileSync("src/day.16.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const [, name, flowRate, neighbors] = [
        ...x
          .match(
            /^Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/
          )!
          .values(),
      ];

      return {
        name,
        flowRate: Number(flowRate),
        neighbors: neighbors.split(", "),
      };
    })
    .reduce(
      (scan, valve) => scan.set(valve.name, valve),
      new Map<string, Valve>()
    );

  function getNeighbors(key: string) {
    return valveLookup.get(key)!.neighbors;
  }

  function getDistance(_x: string, _y: string) {
    return 1;
  }

  const distanceLookup = [...valveLookup.values()]
    .filter((x) => x.flowRate > 0 || x.name === START_VALVE)
    .reduce((distanceLookup, valve, i, valves) => {
      for (let j = i + 1; j < valves.length; j++) {
        if (!distanceLookup.get(valve.name)) {
          distanceLookup.set(valve.name, new Map<string, number>());
        }

        if (!distanceLookup.get(valves[j].name)) {
          distanceLookup.set(valves[j].name, new Map<string, number>());
        }

        const result = search(
          getNeighbors,
          getDistance,
          valve.name,
          valves[j].name
        );

        const distance = result.distanceLookup.get(valves[j].name)!;

        distanceLookup.get(valve.name)!.set(valves[j].name, distance);
        distanceLookup.get(valves[j].name)!.set(valve.name, distance);
      }

      return distanceLookup;
    }, new Map<string, Map<string, number>>());

  const openLookup = new Map<string, number>(
    [...distanceLookup.keys()]
      .filter((x) => x !== START_VALVE)
      .map((name) => [name, 0])
  );

  return {
    valveLookup,
    distanceLookup,
    openLookup,
  };
}

export function part1() {
  const scan = parseInput();
  return getMaximumPressureReleased(scan, 1, 30);
}

export function part2() {
  const scan = parseInput();
  return getMaximumPressureReleased(scan, 2, 26);
}

function getMaximumPressureReleased(
  { valveLookup, distanceLookup, openLookup }: Scan,
  actorCount: number,
  timeLimit: number
) {
  let maxPressureReleased = 0;

  const context: Context = {
    locations: new Array<string>(actorCount).fill(START_VALVE),
    times: new Array<number>(actorCount).fill(0),
    actions: [],
    valveLookup,
    distanceLookup,
    openLookup,
  };

  outerLoop: while (1) {
    let action: Action | undefined = undefined;

    const pressureReleased = getPressureReleased(context, timeLimit);
    const bestPressureReleased =
      pressureReleased + getBestRemainingPressureReleased(context, timeLimit);

    const possibleMoves = getPossibleMoves(context, actorCount, timeLimit);

    if (
      bestPressureReleased < maxPressureReleased ||
      possibleMoves.length === 0
    ) {
      if (pressureReleased > maxPressureReleased) {
        maxPressureReleased = pressureReleased;
      }

      // NOTE - Backtrack!

      while (1) {
        action = context.actions.pop();

        // NOTE - We've exhausted all possible actions, so we're done.

        if (action === undefined) {
          break outerLoop;
        }

        // NOTE - Undo action.

        for (const { actor, from, to } of action.moves) {
          context.locations[actor] = from;
          context.times[actor] -= distanceLookup.get(to)!.get(from)! + 1;
          context.openLookup.set(to, 0);
        }

        // NOTE - If we still have possible moves, try the next one.

        if (action.possibleMoves.length > 0) {
          const moves = action.possibleMoves.pop()!;
          action.moves = moves;
          break;
        }
      }
    }

    if (action === undefined) {
      const moves = possibleMoves.pop()!;

      action = {
        moves,
        possibleMoves,
      };
    }

    // NOTE - Do action.

    for (const { actor, from, to } of action.moves) {
      context.locations[actor] = to;
      context.times[actor] += distanceLookup.get(from)!.get(to)! + 1;
      context.openLookup.set(to, context.times[actor]);
    }

    context.actions.push(action);
  }

  return maxPressureReleased;
}

function getPossibleMoves(
  { locations, times, valveLookup, distanceLookup, openLookup }: Context,
  actorCount: number,
  timeLimit: number
) {
  const actorMoves: Move[][] = [...new Array(actorCount).keys()].map((actor) =>
    [...openLookup.entries()]
      .filter(
        ([name, open]) =>
          open === 0 &&
          distanceLookup.get(locations[actor])!.get(name)! + times[actor] <
            timeLimit
      )
      .map(([name]) => ({ actor, from: locations[actor], to: name }))
      .sort(
        (x, y) =>
          valveLookup.get(y.to)!.flowRate - valveLookup.get(x.to)!.flowRate
      )
  );

  const product = cartesian(...actorMoves);

  const filteredProduct = product.filter(
    (x) => new Set(x.map(({ actor }) => actor)).size === actorCount
  );

  return filteredProduct;
}

function getPressureReleased(
  { valveLookup, openLookup }: Context,
  timeLimit: number
) {
  return [...openLookup.entries()]
    .filter(([, open]) => open > 0)
    .map(([name, open]) => {
      const valve = valveLookup.get(name)!;
      return Math.max(0, valve.flowRate * (timeLimit - open));
    })
    .reduce((sum, val) => sum + val, 0);
}

function getBestRemainingPressureReleased(
  { locations, times, valveLookup, distanceLookup, openLookup }: Context,
  timeLimit: number
) {
  return [...openLookup.entries()]
    .filter(([, open]) => open === 0)
    .map(([name]) => {
      const valve = valveLookup.get(name)!;

      const actor = times.indexOf(Math.min(...times));

      const location = locations[actor];
      const time = times[actor];

      const distance = distanceLookup.get(location)!.get(name)!;

      return valve.flowRate * Math.max(0, timeLimit - (time + distance + 1));
    })
    .reduce((sum, val) => sum + val, 0);
}
