import fs from "fs";

type Motion = { direction: "L" | "R" | "D" | "U"; count: number };

type Position = { x: number; y: number };

function parseInput(): Motion[] {
  return fs
    .readFileSync("src/day.9.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");

      return {
        direction: parts[0] as Motion["direction"],
        count: Number(parts[1]),
      };
    });
}

export function part1() {
  const motions = parseInput();
  return getVisitedCount(motions, 2);
}

export function part2() {
  const motions = parseInput();
  return getVisitedCount(motions, 10);
}

function getVisitedCount(motions: Motion[], knotCount: number) {
  const knots: Position[] = [];

  for (let i = 0; i < knotCount; i++) {
    knots.push({ x: 0, y: 0 });
  }

  const visited = new Set<string>(["0|0"]);

  for (const { direction, count } of motions) {
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
        case "D": {
          knots[0].y--;
          break;
        }
        case "U": {
          knots[0].y++;
          break;
        }
      }

      for (let j = 1; j < knots.length; j++) {
        const head = knots[j - 1];
        const tail = knots[j];

        if (requiresMove(head, tail)) {
          const dx = head.x - tail.x;
          const dy = head.y - tail.y;

          tail.x += dx > 0 ? 1 : dx < 0 ? -1 : 0;
          tail.y += dy > 0 ? 1 : dy < 0 ? -1 : 0;
        }
      }

      visited.add(`${knots[knots.length - 1].x}|${knots[knots.length - 1].y}`);
    }
  }

  return visited.size;
}

function requiresMove(
  head: { x: number; y: number },
  tail: { x: number; y: number }
) {
  const xDist = Math.abs(head.x - tail.x);
  const yDist = Math.abs(head.y - tail.y);

  return !(xDist + yDist < 2 || (xDist === 1 && yDist === 1));
}
