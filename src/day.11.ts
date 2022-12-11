import fs from "fs";

type Monkey = {
  id: number;
  items: number[];
  operation: "+" | "*";
  parameter1: string;
  parameter2: string;
  divisor: number;
  ifTrue: number;
  ifFalse: number;
  count: number;
};

function parseInput(): Monkey[] {
  return fs
    .readFileSync("src/day.11.input.txt")
    .toString()
    .split("\n\n")
    .filter((x) => x)
    .map((x) => {
      const lines = x.split("\n");

      const [, parameter1, operation, parameter2] = lines[2]
        .match(/new = (old|\d+) (\+|\*) (old|\d+)/)!
        .values();

      return {
        id: Number(lines[0].match(/\d/)),
        items: lines[1].match(/\d+/g)!.map(Number),
        operation: operation as Monkey["operation"],
        parameter1,
        parameter2,
        divisor: Number(lines[3].match(/\d+/)),
        ifTrue: Number(lines[4].match(/\d/)),
        ifFalse: Number(lines[5].match(/\d/)),
        count: 0,
      };
    });
}

export function part1() {
  const monkeys = parseInput();
  return getMonkeyBusinessLevel(monkeys, 20, true);
}

export function part2() {
  const monkeys = parseInput();
  return getMonkeyBusinessLevel(monkeys, 10000, false);
}

function getMonkeyBusinessLevel(
  monkeys: Monkey[],
  rounds: number,
  doRelief: boolean
) {
  const modulus = monkeys
    .map((x) => x.divisor)
    .reduce((product, divisor) => product * divisor);

  for (let round = 0; round < rounds; round++) {
    for (const monkey of monkeys) {
      const { items, operation, divisor, ifTrue, ifFalse } = monkey;

      monkey.count += items.length;

      while (items.length) {
        let item = items.shift()!;

        const parameter1 =
          monkey.parameter1 === "old" ? item : Number(monkey.parameter1);

        const parameter2 =
          monkey.parameter2 === "old" ? item : Number(monkey.parameter2);

        switch (operation) {
          case "+": {
            item = (parameter1 + parameter2) % modulus;
            break;
          }

          case "*": {
            item = (parameter1 * parameter2) % modulus;
            break;
          }
        }

        if (doRelief) {
          item = Math.floor(item / 3);
        }

        if (item % divisor === 0) {
          monkeys[ifTrue].items.push(item);
        } else {
          monkeys[ifFalse].items.push(item);
        }
      }
    }
  }

  return monkeys
    .map((x) => x.count)
    .sort((x, y) => x - y)
    .slice(-2)
    .reduce((product, count) => product * count);
}
