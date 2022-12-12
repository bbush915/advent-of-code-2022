import fs from "fs";
import { dijkstra } from "./utils/graph";

function parseInput() {
  return fs
    .readFileSync("src/day.12.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

export function part1() {
  const input = parseInput();

  let current: string = "";
  let dest: string = "";

  for (let i = 0; i < input.length; i++) {
    const startIdx = input[i].findIndex((x) => x == "S");
    if (startIdx !== -1) {
      current = `${i}|${startIdx}`;
      input[i][startIdx] = "a";
    }

    const destIdx = input[i].findIndex((x) => x == "E");
    if (destIdx !== -1) {
      dest = `${i}|${destIdx}`;
      input[i][destIdx] = "z";
    }
  }

  function getNeighbors(key: string) {
    const [i, j] = key.split("|").map(Number);

    const neighbors: string[] = [];

    if (
      i > 0 &&
      input[i - 1][j].charCodeAt(0) <= input[i][j].charCodeAt(0) + 1
    ) {
      neighbors.push(`${i - 1}|${j}`);
    }

    if (
      j > 0 &&
      input[i][j - 1].charCodeAt(0) <= input[i][j].charCodeAt(0) + 1
    ) {
      neighbors.push(`${i}|${j - 1}`);
    }

    if (
      j < input[i].length - 1 &&
      input[i][j + 1].charCodeAt(0) <= input[i][j].charCodeAt(0) + 1
    ) {
      neighbors.push(`${i}|${j + 1}`);
    }

    if (
      i < input.length - 1 &&
      input[i + 1][j].charCodeAt(0) <= input[i][j].charCodeAt(0) + 1
    ) {
      neighbors.push(`${i + 1}|${j}`);
    }

    return neighbors;
  }

  function getDistance(x: string, y: string) {
    return 1;
  }

  let lowest = 100000;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "a") {
        const result = dijkstra(
          { getNeighbors, getDistance },
          `${i}|${j}`,
          dest
        );

        const dist = result.distanceLookup.get(dest);
        console.log(dist);

        if (dist < lowest) {
          lowest = dist;
        }
      }
    }
  }

  return lowest;

  //return result.distanceLookup.get(dest);
}

export function part2() {
  return 0;
}
