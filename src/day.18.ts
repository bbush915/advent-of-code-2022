import fs from "fs";

function parseInput() {
  return new Set<string>(
    fs
      .readFileSync("src/day.18.input.txt")
      .toString()
      .split("\n")
      .filter((x) => x)
  );
}

export function part1() {
  const cubes = parseInput();

  let interiorSides = 0;

  for (const cube of cubes) {
    const [x, y, z] = fromKey(cube);

    interiorSides += [
      [x - 1, y, z],
      [x + 1, y, z],
      [x, y - 1, z],
      [x, y + 1, z],
      [x, y, z - 1],
      [x, y, z + 1],
    ]
      .map(([x, y, z]) => toKey(x, y, z))
      .filter((key) => cubes.has(key)).length;
  }

  return 6 * cubes.size - interiorSides;
}

export function part2() {
  const cubes = parseInput();
  const envelope = getEnvelope(cubes);

  let totalSides = 0;

  for (const cube of cubes) {
    const [x, y, z] = fromKey(cube);

    totalSides += [
      [x - 1, y, z],
      [x + 1, y, z],
      [x, y - 1, z],
      [x, y + 1, z],
      [x, y, z - 1],
      [x, y, z + 1],
    ]
      .map(([x, y, z]) => toKey(x, y, z))
      .filter((key) => envelope.has(key) && !cubes.has(key)).length;
  }

  return totalSides;
}

function toKey(x: number, y: number, z: number) {
  return `${x},${y},${z}`;
}

function fromKey(key: string) {
  return key.split(",").map(Number);
}

function getEnvelope(cubes: Set<string>) {
  const envelope = new Set<string>();

  // NOTE - Calculate bounds and feed neighbor function.

  const coordinates = [...cubes.values()].map(fromKey);

  const minX = Math.min(...coordinates.map(([x]) => x)) - 1;
  const maxX = Math.max(...coordinates.map(([x]) => x)) + 1;
  const minY = Math.min(...coordinates.map(([, y]) => y)) - 1;
  const maxY = Math.max(...coordinates.map(([, y]) => y)) + 1;
  const minZ = Math.min(...coordinates.map(([, , z]) => z)) - 1;
  const maxZ = Math.max(...coordinates.map(([, , z]) => z)) + 1;

  const getNeighbors = curryGetNeighbors(minX, maxX, minY, maxY, minZ, maxZ);

  // NOTE - Flood fill from lower corner to determine envelope.

  const stack = [toKey(minX - 1, minY - 1, minZ - 1)];

  while (stack.length > 0) {
    const key = stack.pop()!;
    envelope.add(key);

    if (cubes.has(key)) {
      continue;
    }

    const neighbors = getNeighbors(key).filter((x) => !envelope.has(x));
    stack.push(...neighbors);
  }

  return envelope;
}

function curryGetNeighbors(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number
) {
  return function getNeighbors(key: string) {
    const [x, y, z] = fromKey(key);

    const neighbors: string[] = [];

    if (x > minX) {
      neighbors.push(toKey(x - 1, y, z));
    }

    if (x < maxX) {
      neighbors.push(toKey(x + 1, y, z));
    }

    if (y > minY) {
      neighbors.push(toKey(x, y - 1, z));
    }

    if (y < maxY) {
      neighbors.push(toKey(x, y + 1, z));
    }

    if (z > minZ) {
      neighbors.push(toKey(x, y, z - 1));
    }

    if (z < maxZ) {
      neighbors.push(toKey(x, y, z + 1));
    }

    return neighbors;
  };
}
