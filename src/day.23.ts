import fs from "fs";

enum Directions {
  NORTH,
  SOUTH,
  WEST,
  EAST,
}

function parseInput() {
  return fs
    .readFileSync("src/day.23.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .flatMap((line, i) =>
      line
        .split("")
        .map((character, j) => [character, j])
        .filter(([character]) => character === "#")
        .map(([, j]) => toKey(i, j as number))
    )
    .reduce((positions, key) => positions.add(key), new Set<string>());
}

export function part1() {
  const positions = parseInput();

  for (let round = 0; round < 10; round++) {
    simulate(positions, round);
  }

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const position of positions) {
    const [x, y] = fromKey(position);

    if (x < minX) {
      minX = x;
    }

    if (x > maxX) {
      maxX = x;
    }

    if (y < minY) {
      minY = y;
    }

    if (y > maxY) {
      maxY = y;
    }
  }

  return (maxX - minX + 1) * (maxY - minY + 1) - positions.size;
}

export function part2() {
  const positions = parseInput();

  let round = 0;

  while (1) {
    if (!simulate(positions, round)) {
      break;
    }

    round++;
  }

  return round + 1;
}

function toKey(x: number, y: number) {
  return `${x}|${y}`;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}

function simulate(positions: Set<string>, round: number) {
  // NOTE - Determine proposals.

  const proposals = new Map<string, string[]>();

  for (const oldPosition of positions) {
    const [x, y] = fromKey(oldPosition);

    const adjacent = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ].map(([x, y]) => positions.has(toKey(x, y)));

    if (adjacent.filter((x) => x).length > 0) {
      for (let i = 0; i < 4; i++) {
        let newPosition: string | null = null;

        switch ((round + i) % 4) {
          case Directions.NORTH: {
            if (!adjacent[0] && !adjacent[1] && !adjacent[2]) {
              newPosition = toKey(x - 1, y);
            }
            break;
          }
          case Directions.SOUTH: {
            if (!adjacent[5] && !adjacent[6] && !adjacent[7]) {
              newPosition = toKey(x + 1, y);
            }
            break;
          }
          case Directions.WEST: {
            if (!adjacent[0] && !adjacent[3] && !adjacent[5]) {
              newPosition = toKey(x, y - 1);
            }
            break;
          }
          case Directions.EAST: {
            if (!adjacent[2] && !adjacent[4] && !adjacent[7]) {
              newPosition = toKey(x, y + 1);
            }
            break;
          }
        }

        if (newPosition) {
          if (!proposals.has(newPosition)) {
            proposals.set(newPosition, [oldPosition]);
          } else {
            proposals.get(newPosition)!.push(oldPosition);
          }

          break;
        }
      }
    }
  }

  if (proposals.size === 0) {
    return false;
  }

  // NOTE - Execute proposals.

  for (const [newPosition, oldPositions] of proposals) {
    if (oldPositions.length > 1) {
      continue;
    }

    positions.delete(oldPositions[0]);
    positions.add(newPosition);
  }

  return true;
}
