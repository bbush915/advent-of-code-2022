import fs from "fs";

import { clone } from "./utils/common";

type Blueprint = number[][];

type State = number[];

enum Resources {
  ORE,
  CLAY,
  OBSIDIAN,
  GEODE,
}

enum Robots {
  ORE = 4,
  CLAY,
  OBSIDIAN,
  GEODE,
}

enum Decisions {
  WAIT,
  BUILD_ORE_ROBOT,
  BUILD_CLAY_ROBOT,
  BUILD_OBSIDIAN_ROBOT,
  BUILD_GEODE_ROBOT,
}

const TIME = 8;

function parseInput(): Blueprint[] {
  return fs
    .readFileSync("src/day.19.example.1.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x, i) => {
      const parts = x.split(": ")[1].split(". ");

      return [
        [Number(parts[0].split(" ")[4]), 0, 0],
        [Number(parts[1].split(" ")[4]), 0, 0],
        [Number(parts[2].split(" ")[4]), Number(parts[2].split(" ")[7]), 0],
        [Number(parts[3].split(" ")[4]), 0, Number(parts[3].split(" ")[7])],
      ];
    });
}

export function part1() {
  const blueprints = parseInput();

  return blueprints
    .map(
      (blueprint, i) =>
        (i + 1) *
        // getMaxGeodeCountForwards(blueprint, 24, [0, 0, 0, 0, 1, 0, 0, 0, 0])
        getMaxGeodeCountBackwards(blueprint, 24)
    )
    .reduce((product, qualityLevel) => product * qualityLevel, 1);
}

export function part2() {
  const blueprints = parseInput();

  return blueprints
    .slice(0, 3)
    .map((blueprint) =>
      // getMaxGeodeCountForwards(blueprint, 32, [0, 0, 0, 0, 1, 0, 0, 0, 0])
      getMaxGeodeCountBackwards(blueprint, 32)
    )
    .reduce((sum, qualityLevel) => sum + qualityLevel, 0);
}

// function getMaxGeodeCountForwards(
//   blueprint: Blueprint,
//   timeLimit: number,
//   state: State
// ): number {
//   if (state[TIME] === timeLimit) {
//     return state[Resources.GEODE];
//   }

//   const geodeCounts = getPossibleDecisions(blueprint, state).map((decision) => {
//     const decisionState = clone(state);

//     decisionState[TIME]++;

//     for (let i = 0; i < 4; i++) {
//       decisionState[i] += decisionState[i + 4];
//     }

//     switch (decision) {
//       case Decisions.BUILD_ORE_ROBOT: {
//         decisionState[Robots.ORE]++;

//         decisionState[Resources.ORE] -= blueprint[Resources.ORE][Resources.ORE];

//         break;
//       }

//       case Decisions.BUILD_CLAY_ROBOT: {
//         decisionState[Robots.CLAY]++;

//         decisionState[Resources.ORE] -=
//           blueprint[Resources.CLAY][Resources.ORE];

//         break;
//       }

//       case Decisions.BUILD_OBSIDIAN_ROBOT: {
//         decisionState[Robots.OBSIDIAN]++;

//         decisionState[Resources.ORE] -=
//           blueprint[Resources.OBSIDIAN][Resources.ORE];
//         decisionState[Resources.CLAY] -=
//           blueprint[Resources.OBSIDIAN][Resources.CLAY];

//         break;
//       }

//       case Decisions.BUILD_GEODE_ROBOT: {
//         decisionState[Robots.GEODE]++;

//         decisionState[Resources.ORE] -=
//           blueprint[Resources.GEODE][Resources.ORE];
//         decisionState[Resources.OBSIDIAN] -=
//           blueprint[Resources.GEODE][Resources.OBSIDIAN];

//         break;
//       }
//     }

//     return getMaxGeodeCount(blueprint, timeLimit, decisionState);
//   });

//   return Math.max(...geodeCounts);
// }

// function getPossibleDecisions(blueprint: Blueprint, state: State) {
//   const decisions = [Decisions.WAIT];

//   // NOTE - Ore

//   if (state[Resources.ORE] >= blueprint[Resources.ORE][Resources.ORE]) {
//     decisions.push(Decisions.BUILD_ORE_ROBOT);
//   }

//   // NOTE - Clay

//   if (state[Resources.ORE] >= blueprint[Resources.CLAY][Resources.ORE]) {
//     decisions.push(Decisions.BUILD_CLAY_ROBOT);
//   }

//   // NOTE - Obsidian

//   if (
//     state[Resources.ORE] >= blueprint[Resources.OBSIDIAN][Resources.ORE] &&
//     state[Resources.CLAY] >= blueprint[Resources.OBSIDIAN][Resources.CLAY]
//   ) {
//     decisions.push(Decisions.BUILD_OBSIDIAN_ROBOT);
//   }

//   // NOTE - Geode

//   if (
//     state[Resources.ORE] >= blueprint[Resources.GEODE][Resources.ORE] &&
//     state[Resources.OBSIDIAN] >= blueprint[Resources.GEODE][Resources.OBSIDIAN]
//   ) {
//     decisions.push(Decisions.BUILD_GEODE_ROBOT);
//   }

//   return decisions.reverse();
// }

function getMaxGeodeCountBackwards(blueprint: Blueprint, timeLimit: number) {
  let maxGeodeCount = 0;

  while (isGeodeCountAchievable(blueprint, timeLimit, maxGeodeCount + 1)) {
    maxGeodeCount++;
  }

  return maxGeodeCount;
}

function isGeodeCountAchievable(
  blueprint: Blueprint,
  timeLimit: number,
  geodeCount: number
) {
  return false;
}
