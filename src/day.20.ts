import fs from "fs";

import { clone } from "./utils/common";

type Value = { x: number; i: number };

function parseInput(): Value[] {
  return fs
    .readFileSync("src/day.20.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x, i) => ({ x: Number(x), i }));
}

export function part1() {
  const values = parseInput();

  mix(values, 1);

  return getCoordinateSum(values);
}

export function part2() {
  const values = parseInput();

  for (const value of values) {
    value.x *= 811589153;
  }

  mix(values, 10);

  return getCoordinateSum(values);
}

function mix(values: Value[], iterations: number) {
  const referenceValues = clone(values);

  for (let n = 0; n < iterations; n++) {
    for (const value of referenceValues) {
      const index = values.findIndex(
        ({ x, i }) => x === value.x && i === value.i
      );

      values.splice(index, 1);

      const newIndex = (index + value.x + values.length) % values.length;

      values.splice(newIndex, 0, value);

      if (value.x && newIndex === 0) {
        values.push(values.shift()!);
      }
    }
  }
}

function getCoordinateSum(values: Value[]) {
  const baseIndex = values.findIndex(({ x }) => x === 0)!;

  return (
    values[(baseIndex + 1000) % values.length].x +
    values[(baseIndex + 2000) % values.length].x +
    values[(baseIndex + 3000) % values.length].x
  );
}
