import fs from "fs";

import { dijkstra } from "./utils/graph";

type Valve = {
  name: string;
  flowRate: number;
  neighbors: string[];
};

type Context = {
  valveLookup: Map<string, Valve>;
  distanceLookup: Map<string, Map<string, number>>;
  current: string[];
  t: number[];
  openedLookup: Map<string, number>;
};

type Possibility = { actor: Actors; to: string };

type Move = {
  actor: Actors;
  from: string;
  to: string;
  possibilities: Possibility[];
};

enum Actors {
  ME = 0,
  ELEPHANT = 1,
}

function parseInput() {
  return fs
    .readFileSync("src/day.16.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const name = x.match(/[A-Z]{2}/)![0];
      const flowRate = Number(x.match(/\d+/)![0]);
      const neighbors = x.split(/ valves? /)[1].split(", ");

      return {
        name,
        flowRate,
        neighbors,
      };
    })
    .reduce(
      (scan, valve) => scan.set(valve.name, valve),
      new Map<string, Valve>()
    );
}

export function part1() {
  const valveLookup = parseInput();

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

  let maxPressureReleased = 0;

  const context: Context = {
    valveLookup,
    distanceLookup,
    current: ["AA", "AA"],
    t: [0, 0],
    openedLookup,
  };

  const moves: Move[] = [];

  outer: while (1) {
    let move: Move | undefined = undefined;

    const possibilities = curryGetPossibilities(26)(context);
    const pressureReleased = curryGetPressureReleased(26)(context);

    // NOTE - Calculate best possible pressure released to know if we can
    // safely backtrack.

    const bestPressureReleased =
      pressureReleased +
      [...context.openedLookup.entries()]
        .filter(([, opened]) => opened === 0)
        .map(([name]) => {
          const valve = context.valveLookup.get(name)!;

          const actor =
            context.t[Actors.ME] < context.t[Actors.ELEPHANT]
              ? Actors.ME
              : Actors.ELEPHANT;

          return (
            valve.flowRate *
            (26 -
              (context.t[actor] +
                context.distanceLookup.get(context.current[actor])!.get(name)! +
                1))
          );
        })
        .reduce((sum, val) => sum + val, 0);

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

export function part2() {
  return 0;
}

function curryGetPossibilities(cutoff: number) {
  return function getPossibilities({
    distanceLookup,
    current,
    t,
    openedLookup,
  }: Context) {
    return [
      ...[...openedLookup.entries()]
        .filter(
          ([name, opened]) =>
            opened === 0 &&
            distanceLookup.get(current[Actors.ME])!.get(name)! + t[Actors.ME] <
              cutoff
        )
        .map(([name]) => ({
          actor: Actors.ME,
          to: name,
        })),
      ...[...openedLookup.entries()]
        .filter(
          ([name, opened]) =>
            opened === 0 &&
            distanceLookup.get(current[Actors.ELEPHANT])!.get(name)! +
              t[Actors.ELEPHANT] <
              cutoff
        )
        .map(([name]) => ({
          actor: Actors.ELEPHANT,
          to: name,
        })),
    ];
  };
}

function curryGetPressureReleased(cutoff: number) {
  return function getPressureReleased({ valveLookup, openedLookup }: Context) {
    return [...openedLookup.entries()]
      .filter(([, opened]) => opened > 0)
      .map(([name, openend]) => {
        const valve = valveLookup.get(name)!;
        return Math.max(0, valve.flowRate * (cutoff - openend));
      })
      .reduce((sum, val) => sum + val, 0);
  };
}
