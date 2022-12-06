import fs from "fs";

function parseInput() {
  return fs.readFileSync("src/day.6.input.txt").toString();
}

export function part1() {
  const input = parseInput();

  const markers: string[] = [];

  for (let i = 0; i < input.length; i++) {
    console.log(i);
    if (markers.length === 14 && new Set(markers).size === 14) {
      return i;
    }

    if (markers.length === 14) {
      markers.shift();
    }

    markers.push(input[i]);
  }

  return 0;
}

export function part2() {
  return 0;
}
