import fs from "fs";

import { isNumeric } from "./utils/common";

function parseInput() {
  const parts = fs.readFileSync("src/day.5.input.txt").toString().split("\n\n");

  const stacks = parts[0]
    .split("\n")
    .slice(0, -1)
    .reverse()
    .reduce((stacks, level) => {
      const count = (level.length + 1) / 4;

      for (let i = 0; i < count; i++) {
        const crate = level[4 * i + 1];

        if (crate !== " ") {
          (stacks[i] ??= []).push(crate);
        }
      }

      return stacks;
    }, new Array<string[]>());

  const procedure = parts[1]
    .split("\n")
    .filter((x) => x)
    .map((x) =>
      x
        .split(" ")
        .filter((x) => isNumeric(x))
        .map(Number)
    );

  return { stacks, procedure };
}

export function part1() {
  const { stacks, procedure } = parseInput();

  for (const [count, from, to] of procedure) {
    const crates = stacks[from - 1].splice(stacks[from - 1].length - count);
    stacks[to - 1].push(...crates.reverse());
  }

  return getStackTops(stacks);
}

export function part2() {
  const { stacks, procedure } = parseInput();

  for (const [count, from, to] of procedure) {
    const crates = stacks[from - 1].splice(stacks[from - 1].length - count);
    stacks[to - 1].push(...crates);
  }

  return getStackTops(stacks);
}

function getStackTops(stacks: string[][]) {
  let result = "";

  for (const stack of stacks) {
    result += stack[stack.length - 1];
  }

  return result;
}
