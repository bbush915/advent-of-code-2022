import fs from "fs";
import { isNumeric } from "./utils/common";

function parseInput() {
  return fs
    .readFileSync("src/day.13.input.txt")
    .toString()
    .split("\n\n")
    .map((x) => {
      return x
        .split("\n")
        .filter((x) => x)
        .map((x) => JSON.parse(x));
    });
}

export function part1() {
  const input = parseInput();

  let sum = 0;

  for (let n = 0; n < input.length; n++) {
    let [left, right] = input[n];
    if (compareItems(left, right)) {
      sum += n + 1;
    }
  }

  return sum;
}

function compareItems(x: any, y: any): boolean | null {
  if (!Array.isArray(x) && !Array.isArray(y)) {
    return x < y ? true : x > y ? false : null;
  } else if (Array.isArray(x) && Array.isArray(y)) {
    let result: boolean | null = null;

    for (let i = 0; i < Math.max(x.length, y.length); i++) {
      if (x[i] === undefined) {
        return true;
      }

      if (y[i] === undefined) {
        return false;
      }

      result = compareItems(x[i], y[i]);

      if (result !== null) {
        return result;
      }
    }
  } else {
    if (!Array.isArray(x)) {
      return compareItems([x], y);
    } else {
      return compareItems(x, [y]);
    }
  }

  return null;
}

export function part2() {
  const input = parseInput();

  const fullInput = input.flat();
  fullInput.push([[2]], [[6]]);

  fullInput.sort((x, y) => {
    const result = compareItems(x, y);

    if (result === true) {
      return -1;
    } else if (result === false) {
      return 1;
    }

    return 0;
  });
  const idx1 = fullInput.findIndex((x) => x[0] == 2) + 1;
  const idx2 = fullInput.findIndex((x) => x[0] == 6) + 1;

  return idx1 * idx2;
}
