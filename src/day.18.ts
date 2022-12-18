import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.18.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(",").map(Number));
}

export function part1() {
  const input = parseInput();

  let totalSides = 0;

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      if (
        input[i][0] - input[j][0] === 1 &&
        input[i][1] === input[j][1] &&
        input[i][2] === input[j][2]
      ) {
        totalSides++;
      }

      if (
        input[i][0] - input[j][0] === -1 &&
        input[i][1] === input[j][1] &&
        input[i][2] === input[j][2]
      ) {
        totalSides++;
      }

      if (
        input[i][1] - input[j][1] === 1 &&
        input[i][0] === input[j][0] &&
        input[i][2] === input[j][2]
      ) {
        totalSides++;
      }

      if (
        input[i][1] - input[j][1] === -1 &&
        input[i][0] === input[j][0] &&
        input[i][2] === input[j][2]
      ) {
        totalSides++;
      }

      if (
        input[i][2] - input[j][2] === 1 &&
        input[i][1] === input[j][1] &&
        input[i][0] === input[j][0]
      ) {
        totalSides++;
      }

      if (
        input[i][2] - input[j][2] === -1 &&
        input[i][1] === input[j][1] &&
        input[i][0] === input[j][0]
      ) {
        totalSides++;
      }
    }
  }

  return 6 * input.length - 2 * totalSides;
}

export function part2() {
  const input = parseInput();

  let totalSides = 0;

  const minX = Math.min(...input.map((x) => x[0]));
  const maxX = Math.max(...input.map((x) => x[0]));
  const minY = Math.min(...input.map((x) => x[1]));
  const maxY = Math.max(...input.map((x) => x[1]));
  const minZ = Math.min(...input.map((x) => x[2]));
  const maxZ = Math.max(...input.map((x) => x[2]));

  const boundary = new Set<string>();

  function getNeighbors(key: string) {
    const [x, y, z] = key.split("|").map(Number);

    const neighbors: string[] = [];

    if (x > minX - 1) {
      neighbors.push(`${x - 1}|${y}|${z}`);
    }

    if (x < maxX + 1) {
      neighbors.push(`${x + 1}|${y}|${z}`);
    }

    if (y > minY - 1) {
      neighbors.push(`${x}|${y - 1}|${z}`);
    }

    if (y < maxY + 1) {
      neighbors.push(`${x}|${y + 1}|${z}`);
    }

    if (z > minZ - 1) {
      neighbors.push(`${x}|${y}|${z - 1}`);
    }

    if (z < maxZ + 1) {
      neighbors.push(`${x}|${y}|${z + 1}`);
    }

    return neighbors;
  }

  const queue: string[] = [`${minX - 1}|${minY - 1}|${minZ - 1}`];

  outer: while (queue.length > 0) {
    const key = queue.pop()!;
    boundary.add(key);

    const [x, y, z] = key.split("|").map(Number);

    for (let i = 0; i < input.length; i++) {
      if (input[i][0] === x && input[i][1] === y && input[i][2] === z) {
        continue outer;
      }
    }

    const neighbors = getNeighbors(key);
    queue.push(...neighbors.filter((x) => !boundary.has(x)));
  }

  const cubes = new Set<string>(input.map((x) => `${x[0]}|${x[1]}|${x[2]}`));

  for (let i = 0; i < input.length; i++) {
    let key = "";

    key = `${input[i][0] - 1}|${input[i][1]}|${input[i][2]}`;
    if (boundary.has(key) && !cubes.has(key)) {
      totalSides++;
    }

    key = `${input[i][0] + 1}|${input[i][1]}|${input[i][2]}`;
    if (boundary.has(key) && !cubes.has(key)) {
      totalSides++;
    }

    key = `${input[i][0]}|${input[i][1] - 1}|${input[i][2]}`;
    if (boundary.has(key) && !cubes.has(key)) {
      totalSides++;
    }

    key = `${input[i][0]}|${input[i][1] + 1}|${input[i][2]}`;
    if (boundary.has(key) && !cubes.has(key)) {
      totalSides++;
    }

    key = `${input[i][0]}|${input[i][1]}|${input[i][2] - 1}`;
    if (boundary.has(key) && !cubes.has(key)) {
      totalSides++;
    }

    key = `${input[i][0]}|${input[i][1]}|${input[i][2] + 1}`;
    if (boundary.has(key) && !cubes.has(key)) {
      totalSides++;
    }
  }

  return totalSides;
}

function manhattan(a: number[], b: number[]) {
  return a.map((x, i) => Math.abs(x - b[i]));
}
