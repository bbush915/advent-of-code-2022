import fs from "fs";

import { BinaryNode } from "./utils/tree";

type Operation = "+" | "-" | "*" | "/";

type Monkey = {
  name: string;
  job: number | { left: string; operation: Operation; right: string };
};

function parseInput() {
  const monkeyLookup = fs
    .readFileSync("src/day.21.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const monkeyParts = x.split(": ");
      const jobParts = monkeyParts[1].split(" ");

      return {
        name: monkeyParts[0],
        job:
          jobParts.length === 1
            ? Number(jobParts[0])
            : {
                left: jobParts[0],
                operation: jobParts[1] as Operation,
                right: jobParts[2],
              },
      };
    })
    .reduce(
      (lookup, monkey) => lookup.set(monkey.name, monkey),
      new Map<string, Monkey>()
    );

  return buildMonkeyTree(monkeyLookup.get("root")!, monkeyLookup);
}

function buildMonkeyTree(
  monkey: Monkey,
  monkeyLookup: Map<string, Monkey>
): BinaryNode<Monkey> {
  if (typeof monkey.job === "number") {
    return {
      left: null,
      right: null,
      data: monkey,
    };
  }

  return {
    left: buildMonkeyTree(monkeyLookup.get(monkey.job.left)!, monkeyLookup),
    right: buildMonkeyTree(monkeyLookup.get(monkey.job.right)!, monkeyLookup),
    data: monkey,
  };
}

export function part1() {
  const rootMonkey = parseInput();
  return evaluateMonkey(rootMonkey);
}

export function part2() {
  const { left, right } = parseInput();

  const name = "humn";

  if (containsMonkey(left!, name)) {
    return fixMonkey(left!, name, evaluateMonkey(right!));
  } else {
    return fixMonkey(right!, name, evaluateMonkey(left!));
  }
}

function evaluateMonkey(node: BinaryNode<Monkey>): number {
  const monkey = node.data;

  if (typeof monkey.job === "number") {
    return monkey.job;
  }

  const left = evaluateMonkey(node.left!);
  const right = evaluateMonkey(node.right!);

  switch (monkey.job.operation) {
    case "+": {
      return left + right;
    }

    case "-": {
      return left - right;
    }

    case "*": {
      return left * right;
    }

    case "/": {
      return left / right;
    }
  }
}

function containsMonkey(node: BinaryNode<Monkey>, name: string): boolean {
  const monkey = node.data;

  if (typeof monkey.job === "number") {
    return monkey.name === name;
  }

  return containsMonkey(node.left!, name) || containsMonkey(node.right!, name);
}

function fixMonkey(
  { left, right, data: monkey }: BinaryNode<Monkey>,
  name: string,
  result: number
): number {
  if (typeof monkey.job === "number") {
    return result;
  }

  if (containsMonkey(left!, name)) {
    const value = evaluateMonkey(right!);

    switch (monkey.job.operation) {
      case "+": {
        return fixMonkey(left!, name, result - value);
      }

      case "-": {
        return fixMonkey(left!, name, result + value);
      }

      case "*": {
        return fixMonkey(left!, name, result / value);
      }

      case "/": {
        return fixMonkey(left!, name, result * value);
      }
    }
  } else {
    const value = evaluateMonkey(left!);

    switch (monkey.job.operation) {
      case "+": {
        return fixMonkey(right!, name, result - value);
      }

      case "-": {
        return fixMonkey(right!, name, value - result);
      }

      case "*": {
        return fixMonkey(right!, name, result / value);
      }

      case "/": {
        return fixMonkey(right!, name, value / result);
      }
    }
  }
}
