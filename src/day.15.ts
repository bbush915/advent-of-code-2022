import fs from "fs";

import { Point } from "./utils/geometry";

type Sensor = {
  x: number;
  y: number;
  distance: number;
};

enum EndpointType {
  START = 1,
  FINISH = -1,
}

type Interval = {
  a: number;
  b: number;
};

function parseInput(): Sensor[] {
  return fs
    .readFileSync("src/day.15.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((line) => {
      const coordinates = [...line.match(/-?\d+/g)!.values()].map(Number);

      const sensor: Point = { x: coordinates[0], y: coordinates[1] };
      const beacon: Point = { x: coordinates[2], y: coordinates[3] };

      return {
        x: sensor.x,
        y: sensor.y,
        distance: Math.abs(beacon.x - sensor.x) + Math.abs(beacon.y - sensor.y),
      };
    });
}

export function part1(y = 2_000_000) {
  const sensors = parseInput();

  const intervals = getIntervals(sensors, y);
  return sumIntervals(intervals);
}

export function part2(size = 4_000_000) {
  const sensors = parseInput();

  let tuningFrequency = 0;

  for (let y = 0; y < size; y++) {
    const intervals = getIntervals(sensors, y, 0, size);

    if (sumIntervals(intervals) < size) {
      tuningFrequency = 4_000_000 * (intervals[0].b + 1) + y;
      break;
    }
  }

  return tuningFrequency;
}

function getIntervals(
  sensors: Sensor[],
  y: number,
  minX = Number.NEGATIVE_INFINITY,
  maxX = Number.POSITIVE_INFINITY
) {
  const endpoints: { x: number; type: EndpointType }[] = [];

  for (const sensor of sensors) {
    const dy = Math.abs(sensor.y - y);

    if (dy > sensor.distance) {
      continue;
    }

    endpoints.push(
      {
        x: Math.max(minX, sensor.x - (sensor.distance - dy)),
        type: EndpointType.START,
      },
      {
        x: Math.min(maxX, sensor.x + (sensor.distance - dy)),
        type: EndpointType.FINISH,
      }
    );
  }

  const endpointDepths = [
    ...endpoints
      .reduce((map, { x, type }) => {
        const depth =
          (map.get(x) ?? 0) + (type === EndpointType.START ? 1 : -1);
        return map.set(x, depth);
      }, new Map<number, number>())
      .entries(),
  ].sort(([x0], [x1]) => x0 - x1);

  const intervals: Interval[] = [];

  let start: number | null = 0;
  let depth = endpointDepths[0][1];

  for (let i = 1; i < endpointDepths.length; i++) {
    depth += endpointDepths[i][1];

    if (depth === 0) {
      intervals.push({ a: endpointDepths[start!][0], b: endpointDepths[i][0] });
      start = null;
    } else if (start === null) {
      start = i;
    }
  }

  return intervals;
}

function sumIntervals(intervals: Interval[]) {
  return intervals.reduce(
    (sum, interval) => sum + (interval.b - interval.a),
    0
  );
}
