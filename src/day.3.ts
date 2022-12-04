import * as fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.3.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x);
}

export function part1() {
  const rucksacks = parseInput();

  return rucksacks
    .map((rucksack) => {
      const compartment1 = rucksack.slice(0, rucksack.length / 2);
      const compartment2 = rucksack.slice(rucksack.length / 2);

      let priority = 0;

      for (let i = 0; i < compartment1.length; i++) {
        if (compartment2.includes(compartment1[i])) {
          priority = getPriority(compartment1[i]);
          break;
        }
      }

      return priority;
    })
    .reduce((totalPriority, priority) => totalPriority + priority, 0);
}

export function part2() {
  const rucksacks = parseInput();

  let totalPriority = 0;

  for (let i = 0; i < rucksacks.length; i += 3) {
    for (let j = 0; j < rucksacks[i].length; j++) {
      if (
        rucksacks[i + 1].includes(rucksacks[i][j]) &&
        rucksacks[i + 2].includes(rucksacks[i][j])
      ) {
        totalPriority += getPriority(rucksacks[i][j]);
        break;
      }
    }
  }

  return totalPriority;
}

function getPriority(itemType: string) {
  if (itemType === itemType.toLocaleLowerCase()) {
    return itemType.charCodeAt(0) - 96;
  }

  return itemType.charCodeAt(0) - 64 + 26;
}
