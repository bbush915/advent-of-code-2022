import fs from "fs";
import { clone } from "./utils/common";

function parseInput() {
  return fs
    .readFileSync("src/day.20.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x, i) => ({ x: Number(x) * 811589153, i }));
}

export function part1() {
  let input = parseInput();

  const original = clone(input);

  for (let i = 0; i < 10; i++) {
    for (const val of original) {
      const idx = input.findIndex((a) => a.i === val.i && a.x === val.x);
      input.splice(idx, 1);

      const newIdx = (idx + val.x + input.length) % input.length;
      input.splice(newIdx, 0, val);

      if (val.x && newIdx === 0) {
        input.push(input.shift()!);
      }

      //console.log(input);
    }
  }

  const zero = input.findIndex((a) => a.x === 0)!;

  return (
    input[(zero + 1000) % input.length].x +
    input[(zero + 2000) % input.length].x +
    input[(zero + 3000) % input.length].x
  );
}

export function part2() {
  return 0;
}
