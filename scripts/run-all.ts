import fs from "fs";

const days = fs
  .readdirSync("./src")
  .filter((x) => x.match(/^day.\d+.ts$/g))
  .map((x) => Number(x.split(".")[1]))
  .sort((x, y) => x - y);

const start = new Date().getTime();

for (const day of days) {
  const { part1, part2 } = require(`../src/day.${day}`);

  console.info(`----- Day ${day} -----`);

  const { result: p1Answer, timeElapsed: p1TimeElapsed } = timePart(part1);
  console.info(`Part 1: ${p1Answer} [${p1TimeElapsed} ms]`);

  const { result: p2Answer, timeElapsed: p2TimeElapsed } = timePart(part2);
  console.info(`Part 2: ${p2Answer} [${p2TimeElapsed} ms]`);

  console.info();
}

console.info(`Total: ${new Date().getTime() - start} ms`);

function timePart(getResult: () => number | string) {
  const start = new Date().getTime();

  const result = getResult();

  return { result, timeElapsed: new Date().getTime() - start };
}
