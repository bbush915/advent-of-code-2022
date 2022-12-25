import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.25.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

export function part1() {
  const fuelRequirements = parseInput();

  return toSnafu(
    fuelRequirements.reduce(
      (sum, fuelRequirement) => sum + fromSnafu(fuelRequirement),
      0
    )
  );
}

export function part2() {
  // NOTE - Merry Christmas!
  return 0;
}

function toSnafu(value: number) {
  const result: string[] = [];

  while (1) {
    if (value === 0) {
      break;
    }

    switch (value % 5) {
      case 0: {
        result.push("0");
        break;
      }

      case 1: {
        result.push("1");
        value -= 1;
        break;
      }

      case 2: {
        result.push("2");
        value -= 2;
        break;
      }

      case 3: {
        result.push("=");
        value += 2;
        break;
      }

      case 4: {
        result.push("-");
        value += 1;
        break;
      }
    }

    value /= 5;
  }

  return result.reverse().join("");
}

function fromSnafu(value: string[]) {
  let result = 0;

  for (let i = 0; i < value.length; i++) {
    switch (value[value.length - 1 - i]) {
      case "2": {
        result += 2 * 5 ** i;
        break;
      }

      case "1": {
        result += 5 ** i;
        break;
      }

      case "-": {
        result -= 5 ** i;
        break;
      }

      case "=": {
        result -= 2 * 5 ** i;
        break;
      }
    }
  }

  return result;
}
