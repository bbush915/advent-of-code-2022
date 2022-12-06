import fs from "fs";

function parseInput() {
  return fs.readFileSync("src/day.6.input.txt").toString();
}

export function part1() {
  const stream = parseInput();
  return getMarkerIndex(stream, 4);
}

export function part2() {
  const stream = parseInput();
  return getMarkerIndex(stream, 14);
}

function getMarkerIndex(stream: string, size: number) {
  const buffer: string[] = [];

  for (let i = 0; i < stream.length; i++) {
    if (new Set(buffer).size === size) {
      return i;
    }

    if (buffer.length === size) {
      buffer.shift();
    }

    buffer.push(stream[i]);
  }

  return -1;
}
