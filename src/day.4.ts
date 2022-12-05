import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.4.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const [elf1, elf2] = x.split(",");
      return {
        assignment1: elf1.split("-").map(Number),
        assignment2: elf2.split("-").map(Number),
      };
    });
}

export function part1() {
  const pairs = parseInput();

  return pairs.filter(
    ({ assignment1, assignment2 }) =>
      (assignment1[0] >= assignment2[0] && assignment1[1] <= assignment2[1]) ||
      (assignment2[0] >= assignment1[0] && assignment2[1] <= assignment1[1])
  ).length;
}

export function part2() {
  const pairs = parseInput();

  return pairs.filter(
    ({ assignment1, assignment2 }) =>
      (assignment1[1] >= assignment2[0] && assignment1[1] <= assignment2[1]) ||
      (assignment2[1] >= assignment1[0] && assignment2[1] <= assignment1[1])
  ).length;
}
