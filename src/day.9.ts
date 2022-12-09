import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.9.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");
      return {
        direction: parts[0],
        count: Number(parts[1]),
      };
    });
}

export function part1() {
  const input = parseInput();

  let head = { x: 0, y: 0 };
  let tail = { x: 0, y: 0 };
  const positions = new Set<string>(["0|0"]);

  for (const { direction, count } of input) {
    for (let i = 0; i < count; i++) {
      switch (direction) {
        case "L": {
          head.x--;
          if (needsMove(head, tail)) {
            tail.x = head.x + 1;
            if (head.y !== tail.y) {
              tail.y = head.y;
            }
          }
          break;
        }
        case "R": {
          head.x++;
          if (needsMove(head, tail)) {
            tail.x = head.x - 1;
            if (head.y !== tail.y) {
              tail.y = head.y;
            }
          }
          break;
        }
        case "U": {
          head.y++;
          if (needsMove(head, tail)) {
            tail.y = head.y - 1;
            if (head.x !== tail.x) {
              tail.x = head.x;
            }
          }
          break;
        }
        case "D": {
          head.y--;
          if (needsMove(head, tail)) {
            tail.y = head.y + 1;
            if (head.x !== tail.x) {
              tail.x = head.x;
            }
          }
          break;
        }
      }

      positions.add(`${tail.x}|${tail.y}`);
    }
  }

  return positions.size;
}

function needsMove(
  head: { x: number; y: number },
  tail: { x: number; y: number }
) {
  const xDist = Math.abs(head.x - tail.x);
  const yDist = Math.abs(head.y - tail.y);

  return !(xDist + yDist < 2 || (xDist === 1 && yDist === 1));
}

function move(
  direction: "L" | "R" | "U" | "D",
  head: { x: number; y: number },
  tail: { x: number; y: number }
) {
  switch (direction) {
    case "L": {
      head.x--;
      if (needsMove(head, tail)) {
        tail.x = head.x + 1;
        if (head.y !== tail.y) {
          tail.y = head.y;
        }
      }
      break;
    }
    case "R": {
      head.x++;
      if (needsMove(head, tail)) {
        tail.x = head.x - 1;
        if (head.y !== tail.y) {
          tail.y = head.y;
        }
      }
      break;
    }
    case "U": {
      head.y++;
      if (needsMove(head, tail)) {
        tail.y = head.y - 1;
        if (head.x !== tail.x) {
          tail.x = head.x;
        }
      }
      break;
    }
    case "D": {
      head.y--;
      if (needsMove(head, tail)) {
        tail.y = head.y + 1;
        if (head.x !== tail.x) {
          tail.x = head.x;
        }
      }
      break;
    }
  }
}

export function part2() {
  const input = parseInput();

  const knots: { x: number; y: number }[] = [];
  for (let i = 0; i < 10; i++) {
    knots.push({ x: 0, y: 0 });
  }

  const positions = new Set<string>(["0|0"]);

  for (const { direction, count } of input) {
    for (let i = 0; i < count; i++) {
      switch (direction) {
        case "L": {
          knots[0].x--;
          break;
        }
        case "R": {
          knots[0].x++;
          break;
        }
        case "U": {
          knots[0].y++;
          break;
        }
        case "D": {
          knots[0].y--;
          break;
        }
      }

      for (let j = 1; j < knots.length; j++) {
        const head = knots[j - 1];
        const tail = knots[j];

        if (needsMove(head, tail)) {
          const dx = head.x - tail.x;
          const dy = head.y - tail.y;

          tail.x += dx > 0 ? 1 : dx < 0 ? -1 : 0;
          tail.y += dy > 0 ? 1 : dy < 0 ? -1 : 0;
        }
      }

      positions.add(
        `${knots[knots.length - 1].x}|${knots[knots.length - 1].y}`
      );
    }
  }

  return positions.size;
}
