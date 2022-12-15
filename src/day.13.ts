import fs from "fs";

import { isArray } from "./utils/common";

type Packet = Array<number | Packet>;

function parseInput(): Packet[][] {
  return fs
    .readFileSync("src/day.13.input.txt")
    .toString()
    .split("\n\n")
    .map((x) =>
      x
        .split("\n")
        .filter((x) => x)
        .map((x) => JSON.parse(x))
    );
}

export function part1() {
  const distressSignal = parseInput();

  return distressSignal
    .map(([left, right], i) => (compareValues(left, right) < 0 ? i + 1 : 0))
    .reduce((sum, index) => sum + index, 0);
}

export function part2() {
  const packets = [...parseInput().flat(), [[2]], [[6]]].sort(compareValues);
  const sortedPackets = packets.sort(compareValues);

  return (
    (sortedPackets.findIndex((x) => x[0] == 2) + 1) *
    (sortedPackets.findIndex((x) => x[0] == 6) + 1)
  );
}

function compareValues(left: number | Packet, right: number | Packet) {
  let comparison = 0;

  if (isArray(left) && isArray(right)) {
    const left_ = left as Packet;
    const right_ = right as Packet;

    for (let i = 0; i < Math.max(left_.length, right_.length); i++) {
      if (left_[i] === undefined) {
        return -1;
      }

      if (right_[i] === undefined) {
        return 1;
      }

      comparison = compareValues(left_[i], right_[i]);

      if (comparison !== 0) {
        break;
      }
    }
  } else if (!isArray(left) && !isArray(right)) {
    comparison = left < right ? -1 : left > right ? 1 : 0;
  } else {
    comparison = isArray(left)
      ? compareValues(left, [right])
      : compareValues([left], right);
  }

  return comparison;
}
