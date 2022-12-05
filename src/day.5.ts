import fs from "fs";

function parseInput() {
  const [board, moves] = fs
    .readFileSync("src/day.5.input.txt")
    .toString()
    .split("\n\n");

  const newBoard = board.split("\n").slice(0, 8);
  console.log(newBoard);

  const columns: string[][] = [[], [], [], [], [], [], [], [], []];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 9; j++) {
      if (newBoard[7 - i][1 + 4 * j] !== " ") {
        columns[j].push(newBoard[7 - i][1 + 4 * j]);
      }
    }
  }

  const newMoves = moves.split("\n").map((x) => {
    const [, crate, , from, , to] = x.split(" ");
    return [Number(crate), Number(from), Number(to)];
  });

  return { columns, move: newMoves };
}

export function part1() {
  const input = parseInput();

  for (let i = 0; i < input.move.length; i++) {
    const move = input.move[i];

    const crates: string[] = [];
    for (var j = 0; j < move[0]; j++) {
      const crate = input.columns[move[1] - 1].pop();
      if (crate) {
        crates.push(crate);
      } else {
        break;
      }
    }

    console.log(crates);
    var len = crates.length;
    for (let j = 0; j < len; j++) {
      input.columns[move[2] - 1].push(crates.pop()!);
    }
  }

  let answer = "";
  for (let i = 0; i < input.columns.length; i++) {
    answer += input.columns[i].pop();
  }

  return answer;
}

export function part2() {
  return 0;
}
