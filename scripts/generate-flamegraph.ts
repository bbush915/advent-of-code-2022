import commandLineArgs from "command-line-args";
import dotenv from "dotenv";

dotenv.config();

const options = commandLineArgs([
  { name: "day", type: Number, defaultValue: Number(process.env.DAY) },
  { name: "part", alias: "p", type: Number },
  { name: "iterations", alias: "n", type: Number, defaultValue: 50000 },
]);

const { day, part, iterations } = options;

if (!part) {
  console.error("Must specify part (1 or 2)");
  process.exit(1);
}

const { part1, part2 } = require(`../src/day.${day}`);

if (part === 1) {
  for (let i = 0; i < iterations; i++) {
    part1();
  }
}

if (part === 2) {
  for (let i = 0; i < iterations; i++) {
    part2();
  }
}
