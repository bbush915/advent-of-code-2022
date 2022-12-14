import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.14.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" -> ").map((x) => x.split(",").map(Number)));
}

export function part1() {
  const input = parseInput();

  const minX = Math.min(...input.flat().map((x) => x[0]));
  const maxX = Math.max(...input.flat().map((x) => x[0]));
  const minY = Math.min(...input.flat().map((x) => x[1]));
  const maxY = Math.max(...input.flat().map((x) => x[1]));

  const maxmaxY = maxY + 2;

  console.log(minX, maxX, minY, maxY);

  const scan: string[][] = [];

  for (let i = 0; i <= maxY; i++) {
    scan.push(new Array(1001).fill("."));
  }

  scan.push(new Array(1001).fill("."));
  scan.push(new Array(1001).fill("#"));

  for (const blah of input) {
    for (let i = 1; i < blah.length; i++) {
      const first = blah[i - 1];
      const second = blah[i];

      const dx = second[0] - first[0];
      const dy = second[1] - first[1];

      if (dx === 0) {
        for (let j = 0; j <= Math.abs(dy); j++) {
          scan[first[1] + j * Math.sign(dy)][first[0] - 0] = "#";
        }
      } else {
        for (let j = 0; j <= Math.abs(dx); j++) {
          scan[first[1]][first[0] - 0 + j * Math.sign(dx)] = "#";
        }
      }
    }
  }

  console.log(scan.map((x) => x.join("")).join("\n"));

  let count = 1;
  outer: while (1) {
    let curX = 500;
    let curY = 0;

    while (1) {
      // if (curY >= maxY) {
      //   break outer;
      // }

      if (["#", "o"].includes(scan[curY + 1][curX - 0])) {
        if (["#", "o"].includes(scan[curY + 1][curX - 0 - 1])) {
          if (["#", "o"].includes(scan[curY + 1][curX - 0 + 1])) {
            if (curX === 500 && curY === 0) {
              break outer;
            }

            scan[curY][curX - 0] = "o";
            // console.log(scan.map((x) => x.join("")).join("\n"));
            break;
          } else {
            curX += 1;
          }
        } else {
          curX -= 1;
        }
      }

      curY += 1;
    }

    count++;
  }

  return count;
}

export function part2() {
  return 0;
}
