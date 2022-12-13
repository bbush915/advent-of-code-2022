import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.13.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x);
}

export function part1() {
  const input = parseInput();
  console.log(input);

  return 0;
}

export function part2() {
  return 0;
}
