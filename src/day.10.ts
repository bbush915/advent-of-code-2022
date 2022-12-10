import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.10.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");
      return { opcode: parts[0], value: parts[1] ? Number(parts[1]) : null };
    });
}

export function part1() {
  const input = parseInput();

  let signalStrength = 0;
  let x = 1;
  let cycle = 1;
  const crt: string[][] = [];
  for (let i = 0; i < 6; i++) {
    crt.push(new Array(40).fill("."));
  }

  for (const instruction of input) {
    const row = Math.floor(((cycle - 1) % 240) / 40);
    const col = (cycle - 1) % 40;

    if (Math.abs(x - col - 1) < 2) {
      crt[row][col] = "#";
    } else {
      crt[row][col] = ".";
    }

    switch (instruction.opcode) {
      case "noop": {
        break;
      }

      case "addx": {
        cycle++;
        if ((cycle - 20) % 40 === 0) {
          signalStrength += cycle * x;
        }
        x += instruction.value!;

        const row = Math.floor(((cycle - 1) % 240) / 40);
        const col = (cycle - 1) % 40;

        if (Math.abs(x - col - 1) < 2) {
          crt[row][col] = "#";
        } else {
          crt[row][col] = ".";
        }
        break;
      }
    }

    cycle++;
    if ((cycle - 20) % 40 === 0) {
      signalStrength += cycle * x;
    }
  }

  console.log(crt.map((x) => x.join("")).join("\n"));

  return signalStrength;
}

export function part2() {
  return 0;
}
