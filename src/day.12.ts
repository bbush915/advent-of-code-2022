import fs from "fs";

import { dijkstra } from "./utils/graph";

const LOWEST_ELEVATION = "a".charCodeAt(0);
const HIGHEST_ELEVATION = "z".charCodeAt(0);

function parseInput() {
  let source: string;
  let target: string;

  const heightmap = fs
    .readFileSync("src/day.12.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x, i) =>
      x.split("").map((x, j) => {
        if (x === "S") {
          source = getKey(i, j);
          return LOWEST_ELEVATION;
        }

        if (x === "E") {
          target = getKey(i, j);
          return HIGHEST_ELEVATION;
        }

        return x.charCodeAt(0);
      })
    );

  return {
    heightmap,
    source: source!,
    target: target!,
  };
}

export function part1() {
  const { heightmap, source, target } = parseInput();

  const result = dijkstra(
    curryGetNeighbors(heightmap),
    getDistance,
    source,
    target
  );

  return result.distanceLookup.get(target);
}

export function part2() {
  const { heightmap, target } = parseInput();

  let fewestSteps = Number.POSITIVE_INFINITY;

  for (let i = 0; i < heightmap.length; i++) {
    for (let j = 0; j < heightmap[i].length; j++) {
      if (heightmap[i][j] === LOWEST_ELEVATION) {
        const result = dijkstra(
          curryGetNeighbors(heightmap),
          getDistance,
          getKey(i, j),
          target
        );

        const steps = result.distanceLookup.get(target);

        if (steps < fewestSteps) {
          fewestSteps = steps;
        }
      }
    }
  }

  return fewestSteps;
}

function getKey(i: number, j: number) {
  return `${i}|${j}`;
}

function curryGetNeighbors(heightmap: number[][]) {
  return function getNeighbors(key: string) {
    const [i, j] = key.split("|").map(Number);

    const neighbors: string[] = [];

    // NOTE - Left

    if (j > 0 && heightmap[i][j - 1] <= heightmap[i][j] + 1) {
      neighbors.push(getKey(i, j - 1));
    }

    // NOTE - Right

    if (
      j < heightmap[i].length - 1 &&
      heightmap[i][j + 1] <= heightmap[i][j] + 1
    ) {
      neighbors.push(getKey(i, j + 1));
    }

    // NOTE - Up

    if (i > 0 && heightmap[i - 1][j] <= heightmap[i][j] + 1) {
      neighbors.push(getKey(i - 1, j));
    }

    // NOTE - Down

    if (
      i < heightmap.length - 1 &&
      heightmap[i + 1][j] <= heightmap[i][j] + 1
    ) {
      neighbors.push(getKey(i + 1, j));
    }

    return neighbors;
  };
}

function getDistance(_x: string, _y: string) {
  return 1;
}
