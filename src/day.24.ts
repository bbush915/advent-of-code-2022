import fs from "fs";

type Valley = {
  width: number;
  height: number;
};

type Blizzard = Directions;

enum Directions {
  LEFT = "<",
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
}

function parseInput() {
  const tiles = fs
    .readFileSync("src/day.24.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  const height = tiles.length;
  const width = tiles[0].length;

  const blizzardLookup = new Map<string, Blizzard[]>();

  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[i].length; j++) {
      if (Object.values<string>(Directions).includes(tiles[i][j])) {
        blizzardLookup.set(toKey(i, j), [tiles[i][j] as Blizzard]);
      }
    }
  }

  const source: [number, number] = [0, tiles[0].findIndex((x) => x === ".")];

  const target: [number, number] = [
    height - 1,
    tiles[height - 1].findIndex((x) => x === "."),
  ];

  return {
    valley: {
      width,
      height,
    },
    blizzardLookup,
    source,
    target,
  };
}

export function part1() {
  const { valley, blizzardLookup, source, target } = parseInput();

  return getMinimumTime(valley, blizzardLookup, source, target);
}

export function part2() {
  const { valley, blizzardLookup, source, target } = parseInput();

  return (
    getMinimumTime(valley, blizzardLookup, source, target) +
    getMinimumTime(valley, blizzardLookup, target, source) +
    getMinimumTime(valley, blizzardLookup, source, target)
  );
}

function getMinimumTime(
  valley: Valley,
  blizzardLookup: Map<string, Blizzard[]>,
  source: [number, number],
  target: [number, number]
) {
  let time = 0;
  let positions = new Set<string>([toKey(source[0], source[1])]);

  while (1) {
    time++;

    updateBlizzards(valley, blizzardLookup);

    const workingPositions = new Set<string>();

    for (const key of positions) {
      const [x, y] = fromKey(key);

      for (const move of getPossibleMoves(valley, blizzardLookup, target, [
        x,
        y,
      ])) {
        switch (move) {
          case Directions.LEFT: {
            workingPositions.add(toKey(x, y - 1));
            break;
          }

          case Directions.UP: {
            workingPositions.add(toKey(x - 1, y));
            break;
          }

          case Directions.RIGHT: {
            workingPositions.add(toKey(x, y + 1));
            break;
          }

          case Directions.DOWN: {
            workingPositions.add(toKey(x + 1, y));
            break;
          }

          case null: {
            workingPositions.add(toKey(x, y));
            break;
          }
        }
      }
    }

    if (workingPositions.has(toKey(target[0], target[1]))) {
      break;
    }

    positions = workingPositions;
  }

  return time;
}

function updateBlizzards(
  { width, height }: Valley,
  blizzardLookup: Map<string, Blizzard[]>
) {
  const entries = [...blizzardLookup.entries()];

  blizzardLookup.clear();

  for (const [oldKey, blizzards] of entries) {
    for (const blizzard of blizzards) {
      let [x, y] = fromKey(oldKey);

      switch (blizzard) {
        case Directions.LEFT: {
          if (y === 1) {
            y = width - 2;
          } else {
            y--;
          }

          break;
        }

        case Directions.UP: {
          if (x === 1) {
            x = height - 2;
          } else {
            x--;
          }

          break;
        }

        case Directions.RIGHT: {
          if (y === width - 2) {
            y = 1;
          } else {
            y++;
          }

          break;
        }

        case Directions.DOWN: {
          if (x === height - 2) {
            x = 1;
          } else {
            x++;
          }

          break;
        }
      }

      const newKey = toKey(x, y);

      if (!blizzardLookup.has(newKey)) {
        blizzardLookup.set(newKey, [blizzard]);
      } else {
        blizzardLookup.get(newKey)!.push(blizzard);
      }
    }
  }
}

function getPossibleMoves(
  { width, height }: Valley,
  blizzardLookup: Map<string, Blizzard[]>,
  target: [number, number],
  [x, y]: [number, number]
) {
  const moves: (Directions | null)[] = [];

  if (x < height - 1 && y > 1 && !blizzardLookup.has(toKey(x, y - 1))) {
    moves.push(Directions.LEFT);
  }

  if (
    (x > 1 && !blizzardLookup.has(toKey(x - 1, y))) ||
    (x - 1 === target[0] && y === target[1])
  ) {
    moves.push(Directions.UP);
  }

  if (x > 0 && y < width - 2 && !blizzardLookup.has(toKey(x, y + 1))) {
    moves.push(Directions.RIGHT);
  }

  if (
    (x < height - 2 && !blizzardLookup.has(toKey(x + 1, y))) ||
    (x + 1 === target[0] && y === target[1])
  ) {
    moves.push(Directions.DOWN);
  }

  if (!blizzardLookup.has(toKey(x, y))) {
    moves.push(null);
  }

  return moves;
}

function toKey(x: number, y: number) {
  return `${x}|${y}`;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
