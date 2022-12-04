import * as fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.$$DAY$$.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x);
}

export function part1() {
  const input = parseInput();
  console.info(input);

  return 0;
}

export function part2() {}
