import fs from "fs";

function parseInput() {
  const paths = fs
    .readFileSync("src/day.14.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" -> ").map((x) => x.split(",").map(Number)));

  // NOTE - We construct the scan to be have the minimal size necessary for the
  // full simulation, by observing that the result will be a triangle of known
  // size.

  const height = Math.max(...paths.flat().map(([, y]) => y)) + 2;
  const width = 2 * height + 1;

  const scan = [...new Array(height)].map(() => new Array(width).fill("."));
  scan.push(new Array(width).fill("#"));

  // NOTE - Draw rock paths.

  for (const path of paths) {
    for (let i = 1; i < path.length; i++) {
      const [[x0, y0], [x1, y1]] = path.slice(i - 1, i + 1);

      const dx = x1 - x0;
      const dy = y1 - y0;

      for (let t = 0; t < Math.max(Math.abs(dx), Math.abs(dy)) + 1; t++) {
        const x = x0 - (500 - height) + t * Math.sign(dx);
        const y = y0 + t * Math.sign(dy);

        scan[y][x] = "#";
      }
    }
  }

  return scan;
}

export function part1() {
  const scan = parseInput();

  // NOTE - Stop when the first unit of sand enters the abyss.

  const cutoff = scan.length - 3;
  return simulate(scan, ([, y]) => y > cutoff);
}

export function part2() {
  const scan = parseInput();

  // NOTE - Stop when the first unit of sand reaches the source.

  return simulate(scan, ([, y]) => y === 0) + 1;
}

function simulate(
  scan: string[][],
  criteria: (restingPosition: number[]) => boolean
) {
  let count = 0;

  while (1) {
    const restingPosition = produce(scan);

    if (criteria(restingPosition)) {
      // console.log(scan.map((x) => x.join("")).join("\n"));
      break;
    }

    count++;
  }

  return count;
}

function produce(scan: string[][]) {
  let x = (scan[0].length - 1) / 2;
  let y = 0;

  while (1) {
    if (scan[y + 1][x] === ".") {
      y++;

      continue;
    }

    if (scan[y + 1][x - 1] === ".") {
      x--;
      y++;

      continue;
    }

    if (scan[y + 1][x + 1] === ".") {
      x++;
      y++;

      continue;
    }

    break;
  }

  scan[y][x] = "o";

  return [x, y];
}
