import fs from "fs";

import { dijkstra } from "./utils/graph";

type Scan = {
  valveLookup: Map<string, Valve>;
  distanceLookup: Map<string, Map<string, number>>;
  openedLookup: Map<string, number>;
};

type Valve = {
  name: string;
  flowRate: number;
  neighbors: string[];
};

type Context = {
  current: string[];
  t: number[];
  valveLookup: Map<string, Valve>;
  distanceLookup: Map<string, Map<string, number>>;
  openedLookup: Map<string, number>;
};

type Move = {
  actor: number;
  from: string;
  to: string;
  possibilities: Possibility[];
};

type Possibility = { actor: number; to: string };

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
    .filter((x) => x.flowRate > 0 || x.name === "AA")
    .reduce((distanceLookup, valve, i, valves) => {
      for (let j = i + 1; j < valves.length; j++) {
        if (!distanceLookup.get(valve.name)) {
          distanceLookup.set(valve.name, new Map<string, number>());
        }

        if (!distanceLookup.get(valves[j].name)) {
          distanceLookup.set(valves[j].name, new Map<string, number>());
        }

        const result = dijkstra(
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

  const openedLookup = new Map<string, number>(
    [...distanceLookup.keys()]
      .filter((x) => x !== "AA")
      .map((name) => [name, 0])
  );

  return {
    valveLookup,
    distanceLookup,
    openedLookup,
  };
}

export function part1() {
  const scan = parseInput();
  return getMaxPressureReleased(scan, 1, 30);
}

export function part2() {
  const scan = parseInput();
  return getMaxPressureReleased(scan, 2, 26);
}

function getMaxPressureReleased(
  { valveLookup, distanceLookup, openedLookup }: Scan,
  actorCount: number,
  cutoff: number
) {
  let maxPressureReleased = 2650;

  const context: Context = {
    current: new Array<string>(actorCount).fill("AA"),
    t: new Array<number>(actorCount).fill(0),
    valveLookup,
    distanceLookup,
    openedLookup,
  };

  const moves: Move[] = [];

  outer: while (1) {
    let move: Move | undefined = undefined;

    const pressureReleased = getPressureReleased(context, cutoff);
    const bestPressureReleased =
      pressureReleased + getBestRemainingPressureReleased(context, cutoff);

    const possibilities = getPossibilities(context, actorCount, cutoff);

    if (
      possibilities.length === 0 ||
      bestPressureReleased < maxPressureReleased
    ) {
      if (pressureReleased > maxPressureReleased) {
        maxPressureReleased = pressureReleased;
        console.log(maxPressureReleased);
      }

      while (1) {
        move = moves.pop();

        if (move === undefined) {
          break outer;
        }

        context.current[move.actor] = move.from;
        context.t[move.actor] -=
          context.distanceLookup.get(move.to)!.get(move.from)! + 1;
        context.openedLookup.set(move.to, 0);

        if (move.possibilities.length > 0) {
          const possiblity = move.possibilities.pop()!;

          move.actor = possiblity.actor;
          move.from = context.current[possiblity.actor];
          move.to = possiblity.to;

          break;
        }
      }
    }

    if (move === undefined) {
      const possiblity = possibilities.pop()!;

      move = {
        actor: possiblity.actor,
        from: context.current[possiblity.actor],
        to: possiblity.to,
        possibilities,
      };
    }

    context.current[move.actor] = move.to;
    context.t[move.actor] +=
      context.distanceLookup.get(move.from)!.get(move.to)! + 1;
    context.openedLookup.set(move.to, context.t[move.actor]);

    moves.push(move);
  }

  return maxPressureReleased;
}

function getPossibilities(
  { current, t, valveLookup, distanceLookup, openedLookup }: Context,
  actorCount: number,
  cutoff: number
) {
  return [...new Array(actorCount).keys()].flatMap((actor) =>
    [...openedLookup.entries()]
      .filter(
        ([name, opened]) =>
          opened === 0 &&
          distanceLookup.get(current[actor])!.get(name)! + t[actor] < cutoff
      )
      .map(([name]) => ({
        actor,
        to: name,
      }))
      .sort(
        (x, y) =>
          valveLookup.get(y.to)!.flowRate - valveLookup.get(x.to)!.flowRate
      )
  );
}

function getPressureReleased(
  { valveLookup, openedLookup }: Context,
  cutoff: number
) {
  return [...openedLookup.entries()]
    .filter(([, opened]) => opened > 0)
    .map(([name, openend]) => {
      const valve = valveLookup.get(name)!;
      return Math.max(0, valve.flowRate * (cutoff - openend));
    })
    .reduce((sum, val) => sum + val, 0);
}

function getBestRemainingPressureReleased(context: Context, cutoff: number) {
  return [...context.openedLookup.entries()]
    .filter(([, opened]) => opened === 0)
    .map(([name]) => {
      const valve = context.valveLookup.get(name)!;

      const actor = context.t.indexOf(Math.min(...context.t));

      const curent = context.current[actor];
      const t = context.t[actor];

      const distance = context.distanceLookup.get(curent)!.get(name)!;

      return valve.flowRate * Math.max(0, cutoff - (t + distance + 1));
    })
    .reduce((sum, val) => sum + val, 0);
}
