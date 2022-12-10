import fs from "fs";

type Instruction = { opcode: "noop" } | { opcode: "addx"; value: number };

type Context = {
  cycle: number;
  x: number;
  [key: string]: any;
};

function parseInput(): Instruction[] {
  return fs
    .readFileSync("src/day.10.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");

      if (parts[0] === "noop") {
        return { opcode: "noop" };
      }

      return {
        opcode: "addx",
        value: Number(parts[1]),
      };
    });
}

export function part1() {
  const program = parseInput();

  const context: Context = {
    cycle: 0,
    x: 1,
    totalSignalStrength: 0,
  };

  function executeCycle(context: Context) {
    context.cycle++;

    if ((context.cycle - 20) % 40 === 0) {
      context.totalSignalStrength += context.cycle * context.x;
    }
  }

  executeProgram(program, context, executeCycle);

  return context.totalSignalStrength;
}

export function part2() {
  const program = parseInput();

  const context: Context = {
    cycle: 0,
    x: 1,
    crt: [],
  };

  for (let i = 0; i < 6; i++) {
    context.crt.push(new Array(40).fill("."));
  }

  function executeCycle(context: Context) {
    context.cycle++;

    const row = Math.floor(((context.cycle - 1) % 240) / 40);
    const column = (context.cycle - 1) % 40;

    if (Math.abs(context.x - column) < 2) {
      context.crt[row][column] = "#";
    }
  }

  executeProgram(program, context, executeCycle);

  return `\n\n${context.crt.map((x: string[][]) => x.join("")).join("\n")}\n\n`;
}

function executeProgram(
  program: Instruction[],
  context: Context,
  executeCycle: (context: Context) => void
) {
  for (const instruction of program) {
    switch (instruction.opcode) {
      case "noop": {
        executeCycle(context);
        break;
      }

      case "addx": {
        executeCycle(context);
        executeCycle(context);

        context.x += instruction.value;
        break;
      }
    }
  }
}
