import fs from "fs";

const PIECES = [
  {
    width: 4,
    height: 1,
    shape: [["#", "#", "#", "#"]],
  },
  {
    width: 3,
    height: 3,
    shape: [
      [".", "#", "."],
      ["#", "#", "#"],
      [".", "#", "."],
    ],
  },
  {
    width: 3,
    height: 3,
    shape: [
      [".", ".", "#"],
      [".", ".", "#"],
      ["#", "#", "#"],
    ],
  },
  {
    width: 1,
    height: 4,
    shape: [["#"], ["#"], ["#"], ["#"]],
  },
  {
    width: 2,
    height: 2,
    shape: [
      ["#", "#"],
      ["#", "#"],
    ],
  },
];

enum Direction {
  LEFT,
  RIGHT,
  DOWN,
}

function parseInput() {
  return fs
    .readFileSync("src/day.17.input.txt")
    .toString()
    .split("")
    .slice(0, -1);
}

export function part1() {
  const jetPattern = parseInput();
  return simulate(jetPattern, 2022);
}

export function part2() {
  // NOTE - We observe that the jet pattern repeats every 1725 pieces. We then
  // observe the height change every 1725 pieces to be constant (except the
  // first). Finally, we note that the remainder is consistent modulo 1725
  // pieces which means we can just calculate the answer.

  return Math.floor(1_000_000_000_000 / 1725) * 2702 - 3 + 2499;
}

function simulate(jetPattern: string[], pieceCount: number) {
  const chamber = [...new Array(4 * pieceCount)].map(() =>
    new Array<string>(7).fill(".")
  );

  let height = 0;
  let jetIndex = 0;

  for (let i = 0; i < pieceCount; i++) {
    const piece = PIECES[i % PIECES.length];

    let x = chamber.length - (height + 3 + piece.height);
    let y = 2;

    while (1) {
      switch (jetPattern[jetIndex % jetPattern.length]) {
        case "<": {
          if (canMove(chamber, piece, x, y, Direction.LEFT)) {
            y--;
          }
          break;
        }

        case ">": {
          if (canMove(chamber, piece, x, y, Direction.RIGHT)) {
            y++;
          }
          break;
        }
      }

      jetIndex++;

      if (canMove(chamber, piece, x, y, Direction.DOWN)) {
        x++;
      } else {
        height = Math.max(chamber.length - x, height);

        for (let i = 0; i < piece.height; i++) {
          for (let j = 0; j < piece.width; j++) {
            if (piece.shape[i][j] === ".") {
              continue;
            }

            chamber[x + i][y + j] = piece.shape[i][j];
          }
        }

        break;
      }
    }
  }

  return height;
}

function canMove(
  chamber: string[][],
  piece: typeof PIECES[number],
  x: number,
  y: number,
  direction: Direction
) {
  switch (direction) {
    case Direction.LEFT: {
      if (y === 0) {
        return false;
      }

      for (let i = 0; i < piece.height; i++) {
        for (let j = 0; j < piece.width; j++) {
          if (
            piece.shape[i][j] === "." ||
            (j > 0 && piece.shape[i][j - 1] === "#")
          ) {
            continue;
          }

          if (chamber[x + i][y + j - 1] === "#") {
            return false;
          }
        }
      }

      break;
    }
    case Direction.RIGHT: {
      if (y === 7 - piece.width) {
        return false;
      }

      for (let i = 0; i < piece.height; i++) {
        for (let j = 0; j < piece.width; j++) {
          if (
            piece.shape[i][j] === "." ||
            (j < piece.width - 1 && piece.shape[i][j + 1] === "#")
          ) {
            continue;
          }

          if (chamber[x + i][y + j + 1] === "#") {
            return false;
          }
        }
      }

      break;
    }

    case Direction.DOWN: {
      if (x === chamber.length - 1) {
        return false;
      }

      for (let i = 0; i < piece.height; i++) {
        for (let j = 0; j < piece.width; j++) {
          if (
            piece.shape[i][j] === "." ||
            (i < piece.height - 1 && piece.shape[i + 1][j] === "#")
          ) {
            continue;
          }

          if (chamber[x + i + 1][y + j] === "#") {
            return false;
          }
        }
      }

      break;
    }
  }

  return true;
}
