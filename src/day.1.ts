import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("./src/day.1.input.txt")
    .toString()
    .split("\n\n")
    .map((x) =>
      x
        .split("\n")
        .filter((x) => x)
        .map(Number)
    );
}

export function part1() {
  const elfCalories = parseInput();

  return elfCalories
    .map((x) => x.reduce((sum, calories) => sum + calories, 0))
    .sort((x, y) => y - x)[0];
}

export function part2() {
  const elfCalories = parseInput();

  return elfCalories
    .map((x) => x.reduce((sum, calories) => sum + calories, 0))
    .sort((x, y) => y - x)
    .slice(0, 3)
    .reduce((sum, totalCalories) => sum + totalCalories, 0);
}
