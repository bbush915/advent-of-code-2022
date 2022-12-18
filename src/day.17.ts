import fs from "fs";

type Piece = {
  width: number;
  height: number;
  layout: string[][];
};

enum Directions {
  LEFT,
  RIGHT,
  DOWN,
}

const PIECES: Piece[] = [
  {
    width: 4,
    height: 1,
    layout: [["#", "#", "#", "#"]],
  },
  {
    width: 3,
    height: 3,
    layout: [
      [".", "#", "."],
      ["#", "#", "#"],
      [".", "#", "."],
    ],
  },
  {
    width: 3,
    height: 3,
    layout: [
      [".", ".", "#"],
      [".", ".", "#"],
      ["#", "#", "#"],
    ],
  },
  {
    width: 1,
    height: 4,
    layout: [["#"], ["#"], ["#"], ["#"]],
  },
  {
    width: 2,
    height: 2,
    layout: [
      ["#", "#"],
      ["#", "#"],
    ],
  },
];

const CHAMBER_WIDTH = 7;

function parseInput() {
  return fs
    .readFileSync("src/day.17.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)[0]
    .split("");
}

export function part1() {
  const jetPattern = parseInput();
  return simulate(jetPattern, 2022);
}

export function part2() {
  const jetPattern = parseInput();

  // NOTE - We observe that the jet pattern repeats every 1725 piecees after
  // the first 1717. In addition, the height gain is consistent modulo 1725.
  // This allows us to directly calculate the height.

  const base = 1717;
  const period = 1725;

  const order = Math.floor((1_000_000_000_000 - base) / period);
  const remainder = (1_000_000_000_000 - base) % period;

  const baseHeight = simulate(jetPattern, base);
  const repeatHeight = simulate(jetPattern, base + period) - baseHeight;
  const remainderHeight = simulate(jetPattern, base + remainder) - baseHeight;

  return baseHeight + order * repeatHeight + remainderHeight;
}

function simulate(jetPattern: string[], pieceCount: number) {
  const chamber = [...new Array(4 * pieceCount)].map(() =>
    new Array<string>(CHAMBER_WIDTH).fill(".")
  );

  let height = 0;
  let jetIndex = 0;

  for (let i = 0; i < pieceCount; i++) {
    const piece = PIECES[i % PIECES.length];

    let x = chamber.length - (height + 3 + piece.height);
    let y = 2;

    while (1) {
      // NOTE - Apply jet to piece.

      switch (jetPattern[jetIndex % jetPattern.length]) {
        case "<": {
          if (canMove(chamber, piece, x, y, Directions.LEFT)) {
            y--;
          }
          break;
        }

        case ">": {
          if (canMove(chamber, piece, x, y, Directions.RIGHT)) {
            y++;
          }
          break;
        }
      }

      jetIndex++;

      // NOTE - Drop piece.

      if (canMove(chamber, piece, x, y, Directions.DOWN)) {
        x++;
      } else {
        // NOTE - Piece at rest. Update height of tower and update chamber.

        height = Math.max(chamber.length - x, height);

        for (let i = 0; i < piece.height; i++) {
          for (let j = 0; j < piece.width; j++) {
            if (piece.layout[i][j] === ".") {
              continue;
            }

            chamber[x + i][y + j] = piece.layout[i][j];
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
  { width, height, layout }: Piece,
  x: number,
  y: number,
  direction: Directions
) {
  switch (direction) {
    case Directions.LEFT: {
      if (y === 0) {
        return false;
      }

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (layout[i][j] === "." || (j > 0 && layout[i][j - 1] === "#")) {
            continue;
          }

          if (chamber[x + i][y + j - 1] === "#") {
            return false;
          }
        }
      }

      break;
    }
    case Directions.RIGHT: {
      if (y === CHAMBER_WIDTH - width) {
        return false;
      }

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (
            layout[i][j] === "." ||
            (j < width - 1 && layout[i][j + 1] === "#")
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

    case Directions.DOWN: {
      if (x === chamber.length - 1) {
        return false;
      }

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (
            layout[i][j] === "." ||
            (i < height - 1 && layout[i + 1][j] === "#")
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
