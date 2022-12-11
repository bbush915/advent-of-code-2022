import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.11.input.txt")
    .toString()
    .split("\n\n")
    .filter((x) => x)
    .map((x) => {
      const lines = x.split("\n");

      return {
        num: Number(lines[0].split(" ")[1].slice(0, -1)),
        items: lines[1].slice(18).split(",").map(Number),
        operation: lines[2].split(" ")[6],
        param1: lines[2].split(" ")[5],
        param2: lines[2].split(" ")[7],
        test: Number(lines[3].split(" ")[5]),
        onTrue: Number(lines[4].slice(-2)),
        onFalse: Number(lines[5].slice(-2)),
        inspected: 0,
      };
    });
}

export function part1() {
  const input = parseInput();

  const base = input.map((x) => x.test).reduce((prod, val) => prod * val);

  for (let round = 0; round < 10000; round++) {
    for (let i = 0; i < input.length; i++) {
      while (input[i].items.length) {
        let item = input[i].items.shift() as number;

        const param1 =
          (input[i].param1 === "old" ? item : Number(input[i].param1)) % base;
        const param2 =
          (input[i].param2 === "old" ? item : Number(input[i].param2)) % base;

        switch (input[i].operation) {
          case "+": {
            item = (param1 + param2) % base;
            break;
          }

          case "*": {
            item = (param1 * param2) % base;
            break;
          }
        }

        //        item = Math.floor(item / 3);

        if (item % input[i].test === 0) {
          input[input[i].onTrue].items.push(item);
        } else {
          input[input[i].onFalse].items.push(item);
        }

        input[i].inspected++;
      }
    }

    if (round === 19) {
      console.log(input);
    }
  }

  return input
    .map((x) => x.inspected)
    .sort((x, y) => y - x)
    .slice(0, 2)
    .reduce((sum, val) => sum * val);
}

export function part2() {
  return 0;
}
