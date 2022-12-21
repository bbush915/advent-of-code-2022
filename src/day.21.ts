import fs from "fs";

type Monkey = {
  name: string;
  job: number | string[];
};

type Node = {
  left: Node | null;
  right: Node | null;
  value: Monkey;
};

function parseInput(): Monkey[] {
  return fs
    .readFileSync("src/day.21.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(": ");

      const jobParts = parts[1].split(" ");

      return {
        name: parts[0],
        job: jobParts.length === 1 ? Number(jobParts[0]) : jobParts,
      };
    });
}

export function part1() {
  const monkeys = parseInput();

  const monkeyLookup = new Map<string, Monkey>(
    monkeys.map((monkey) => [monkey.name, monkey])
  );

  const tree = buildMonkeyTree(monkeyLookup.get("root")!, monkeyLookup);

  return evaluateMonkeyTree(tree);
}

function buildMonkeyTree(
  monkey: Monkey,
  monkeyLookup: Map<string, Monkey>
): Node {
  if (typeof monkey.job === "number") {
    return {
      left: null,
      right: null,
      value: monkey,
    };
  } else {
    return {
      left: buildMonkeyTree(monkeyLookup.get(monkey.job[0])!, monkeyLookup),
      right: buildMonkeyTree(monkeyLookup.get(monkey.job[2])!, monkeyLookup),
      value: monkey,
    };
  }
}

function evaluateMonkeyTree(root: Node): number {
  if (typeof root.value.job === "number") {
    return root.value.job;
  }

  switch (root.value.job[1]) {
    case "+": {
      return evaluateMonkeyTree(root.left!) + evaluateMonkeyTree(root.right!);
    }

    case "-": {
      return evaluateMonkeyTree(root.left!) - evaluateMonkeyTree(root.right!);
    }

    case "*": {
      return evaluateMonkeyTree(root.left!) * evaluateMonkeyTree(root.right!);
    }

    case "/": {
      return evaluateMonkeyTree(root.left!) / evaluateMonkeyTree(root.right!);
    }

    default: {
      return -1;
    }
  }
}

export function part2() {
  const monkeys = parseInput();

  const monkeyLookup = new Map<string, Monkey>(
    monkeys.map((monkey) => [monkey.name, monkey])
  );

  const tree = buildMonkeyTree(monkeyLookup.get("root")!, monkeyLookup);

  if (hasMonkey(tree.left!, "humn")) {
    return computeMonkeyTree(tree.left!, evaluateMonkeyTree(tree.right!));
  } else {
    return computeMonkeyTree(tree.right!, evaluateMonkeyTree(tree.left!));
  }
}

function computeMonkeyTree(node: Node, target: number): number {
  if (typeof node.value.job === "number") {
    return target;
  }

  if (hasMonkey(node.left!, "humn")) {
    const value = evaluateMonkeyTree(node.right!);

    switch (node.value.job[1]) {
      case "+": {
        return computeMonkeyTree(node.left!, target - value);
      }

      case "-": {
        return computeMonkeyTree(node.left!, target + value);
      }

      case "*": {
        return computeMonkeyTree(node.left!, target / value);
      }

      case "/": {
        return computeMonkeyTree(node.left!, target * value);
      }

      default: {
        return -1;
      }
    }
  } else {
    const value = evaluateMonkeyTree(node.left!);

    switch (node.value.job[1]) {
      case "+": {
        return computeMonkeyTree(node.right!, target - value);
      }

      case "-": {
        return computeMonkeyTree(node.right!, value - target);
      }

      case "*": {
        return computeMonkeyTree(node.right!, target / value);
      }

      case "/": {
        return computeMonkeyTree(node.right!, value / target);
      }

      default: {
        return -1;
      }
    }
  }
}

function hasMonkey(node: Node, name: string): boolean {
  if (typeof node.value.job === "number") {
    return node.value.name === name;
  }

  return hasMonkey(node.left!, name) || hasMonkey(node.right!, name);
}
