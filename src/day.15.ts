import fs from "fs";
import { clone } from "./utils/common";
import { Segment } from "./utils/geometry";

function parseInput() {
  return fs
    .readFileSync("src/day.15.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.match(
        /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
      );

      const values = [...parts!.values()].slice(1).map(Number);

      return {
        sensor: {
          x: values[0],
          y: values[1],
        },
        beacon: {
          x: values[2],
          y: values[3],
        },
        distance: distance(values.slice(0, 2), values.slice(2)),
      };
    });
}

export function part1() {
  const input = parseInput();

  for (let row = 0; row < 4000000; row++) {
    const segments: Segment[] = [];

    for (const i of input) {
      const dy = Math.abs(i.sensor.y - row);

      if (dy > i.distance) {
        continue;
      }

      const width = 2 * (i.distance - dy) + 1;

      const segment: Segment = {
        a: {
          x: Math.max(0, i.sensor.x - (width - 1) / 2),
          y: row,
        },
        b: {
          x: Math.min(4000000, i.sensor.x + (width - 1) / 2),
          y: row,
        },
      };

      segments.push(segment);
    }

    const points = [...new Set(segments.flatMap((s) => [s.a.x, s.b.x]))].sort(
      (x, y) => x - y
    );

    let total = 0;

    for (let i = 1; i < points.length; i++) {
      const left = points[i - 1];
      const right = points[i];

      const include = segments.some((s) =>
        intersect(s, {
          a: { x: left + 1, y: row },
          b: { x: right - 1, y: row },
        })
      );

      if (include) {
        total += right - left;
      }
    }

    if (total < 4000000) {
      const blah = 3;
    }
  }

  return 0;
}

export function part2() {
  const input = parseInput();

  return 0;
}

function intersect(a: Segment, b: Segment) {
  if (a.b.x >= b.a.x && a.b.x <= b.b.x) {
    return {
      a: { x: b.a.x, y: a.a.y },
      b: { x: Math.min(a.b.x, b.b.x), y: a.a.y },
    };
  } else if (a.a.x >= b.a.x && a.a.x <= b.b.x) {
    return {
      a: { x: a.a.x, y: a.a.y },
      b: { x: Math.min(a.b.x, b.b.x), y: a.a.y },
    };
  } else if (a.a.x >= b.a.x && a.b.x <= b.b.x) {
    return {
      a: { x: Math.max(a.a.x, b.a.x), y: a.a.y },
      b: { x: Math.min(a.b.x, b.b.x), y: a.a.y },
    };
  } else if (b.a.x >= a.a.x && b.b.x <= a.b.x) {
    return {
      a: { x: Math.max(a.a.x, b.a.x), y: a.a.y },
      b: { x: Math.min(a.b.x, b.b.x), y: a.a.y },
    };
  } else {
    return null;
  }
}

function distance([x0, y0]: number[], [x1, y1]: number[]) {
  return Math.abs(x0 - x1) + Math.abs(y0 - y1);
}
