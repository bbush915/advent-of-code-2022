import fs from "fs";

import { clone } from "./utils/common";

type Blueprint = number[][];

type State = number[];

type Context = {
  maxTime: number;
  bestGeodeCount: number;
  lookup: Map<string, number>;
};

enum Resources {
  ORE,
  CLAY,
  OBSIDIAN,
  GEODE,
}

enum Robots {
  ORE,
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

function parseInput(): Blueprint[] {
  return fs
    .readFileSync("src/day.19.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
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
        getMaxGeodeCountV2(blueprint, [0, 0, 0, 0, 1, 0, 0, 0, 0], {
          maxTime: 24,
          bestGeodeCount: 0,
          lookup: new Map<string, number>(),
        })
    )
    .reduce((product, qualityLevel) => product * qualityLevel, 1);
}

export function part2() {
  const blueprints = parseInput();

  return blueprints
    .slice(0, 3)
    .map((blueprint) =>
      getMaxGeodeCountV2(blueprint, [0, 0, 0, 0, 1, 0, 0, 0, 0], {
        maxTime: 32,
        bestGeodeCount: 0,
        lookup: new Map<string, number>(),
      })
    )
    .reduce((sum, qualityLevel) => sum + qualityLevel, 0);
}

// function getMaxGeodeCount(
//   blueprint: Blueprint,
//   state: State,
//   context: Context
// ): number {
//   if (state[8] === context.maxTime) {
//     const geodeCount = state[Resources.GEODE];

//     if (geodeCount > context.bestGeodeCount) {
//       context.bestGeodeCount = geodeCount;
//     }

//     return geodeCount;
//   }

//   const key = toKey(state);

//   if (context.lookup.has(key)) {
//     return context.lookup.get(key)!;
//   }

//   const geodeCounts = getPossibleDecisions(blueprint, state).map((decision) => {
//     const decisionState = clone(state);

//     for (let i = 0; i < 4; i++) {
//       decisionState[i] += decisionState[i + 4];
//     }

//     switch (decision) {
//       case Decisions.BUILD_ORE_ROBOT: {
//         decisionState[Robots.ORE + 4]++;

//         decisionState[Resources.ORE] -= blueprint[Resources.ORE][Resources.ORE];

//         break;
//       }

//       case Decisions.BUILD_CLAY_ROBOT: {
//         decisionState[Robots.CLAY + 4]++;

//         decisionState[Resources.ORE] -=
//           blueprint[Resources.CLAY][Resources.ORE];

//         break;
//       }

//       case Decisions.BUILD_OBSIDIAN_ROBOT: {
//         decisionState[Robots.OBSIDIAN + 4]++;

//         decisionState[Resources.ORE] -=
//           blueprint[Resources.OBSIDIAN][Resources.ORE];
//         decisionState[Resources.CLAY] -=
//           blueprint[Resources.OBSIDIAN][Resources.CLAY];

//         break;
//       }

//       case Decisions.BUILD_GEODE_ROBOT: {
//         decisionState[Robots.GEODE + 4]++;

//         decisionState[Resources.ORE] -=
//           blueprint[Resources.GEODE][Resources.ORE];
//         decisionState[Resources.OBSIDIAN] -=
//           blueprint[Resources.GEODE][Resources.OBSIDIAN];

//         break;
//       }
//     }

//     decisionState[8]++;

//     return getMaxGeodeCount(blueprint, decisionState, context);
//   });

//   const maxGeodeCount = Math.max(...geodeCounts);

//   context.lookup.set(key, maxGeodeCount);

//   return maxGeodeCount;
// }

function getMaxGeodeCountV2(
  blueprint: Blueprint,
  state: State,
  { maxTime }: Context
) {
  let states = new Map<number, Set<string>>([
    [0, new Set<string>([toKey(state)])],
  ]);

  for (let i = 0; i < maxTime; i++) {
    let workingStates = new Map<number, Set<string>>();

    for (const [, keys] of states.entries()) {
      for (const key of keys) {
        const state = fromKey(key);

        for (const decision of getPossibleDecisions(blueprint, state)) {
          const decisionState = clone(state);

          for (let i = 0; i < 4; i++) {
            decisionState[i] += decisionState[i + 4];
          }

          switch (decision) {
            case Decisions.BUILD_ORE_ROBOT: {
              decisionState[Robots.ORE + 4]++;

              decisionState[Resources.ORE] -=
                blueprint[Resources.ORE][Resources.ORE];

              break;
            }

            case Decisions.BUILD_CLAY_ROBOT: {
              decisionState[Robots.CLAY + 4]++;

              decisionState[Resources.ORE] -=
                blueprint[Resources.CLAY][Resources.ORE];

              break;
            }

            case Decisions.BUILD_OBSIDIAN_ROBOT: {
              decisionState[Robots.OBSIDIAN + 4]++;

              decisionState[Resources.ORE] -=
                blueprint[Resources.OBSIDIAN][Resources.ORE];
              decisionState[Resources.CLAY] -=
                blueprint[Resources.OBSIDIAN][Resources.CLAY];

              break;
            }

            case Decisions.BUILD_GEODE_ROBOT: {
              decisionState[Robots.GEODE + 4]++;

              decisionState[Resources.ORE] -=
                blueprint[Resources.GEODE][Resources.ORE];
              decisionState[Resources.OBSIDIAN] -=
                blueprint[Resources.GEODE][Resources.OBSIDIAN];

              break;
            }
          }

          if (!workingStates.has(decisionState[Resources.GEODE])) {
            workingStates.set(
              decisionState[Resources.GEODE],
              new Set<string>()
            );
          }

          workingStates
            .get(decisionState[Resources.GEODE])!
            .add(toKey(decisionState));
        }
      }
    }

    const maxGeodeCount = Math.max(...workingStates.keys());

    states = new Map<number, Set<string>>(
      [...workingStates.entries()].filter(
        ([geodeCount]) => geodeCount > maxGeodeCount - 3
      )
    );

    console.log(
      i,
      [...states.entries()].map(
        ([geodeCount, keys]) => `${geodeCount} | ${keys.size}`
      )
    );
  }

  return Math.max(...states.keys());
}

function getPossibleDecisions(blueprint: Blueprint, state: State) {
  const decisions = [Decisions.WAIT];

  // NOTE - Ore

  if (state[Resources.ORE] >= blueprint[Resources.ORE][Resources.ORE]) {
    decisions.push(Decisions.BUILD_ORE_ROBOT);
  }

  // NOTE - Clay

  if (state[Resources.ORE] >= blueprint[Resources.CLAY][Resources.ORE]) {
    decisions.push(Decisions.BUILD_CLAY_ROBOT);
  }

  // NOTE - Obsidian

  if (
    state[Resources.ORE] >= blueprint[Resources.OBSIDIAN][Resources.ORE] &&
    state[Resources.CLAY] >= blueprint[Resources.OBSIDIAN][Resources.CLAY]
  ) {
    decisions.push(Decisions.BUILD_OBSIDIAN_ROBOT);
  }

  // NOTE - Geode

  if (
    state[Resources.ORE] >= blueprint[Resources.GEODE][Resources.ORE] &&
    state[Resources.OBSIDIAN] >= blueprint[Resources.GEODE][Resources.OBSIDIAN]
  ) {
    decisions.push(Decisions.BUILD_GEODE_ROBOT);
  }

  return decisions;
}

function toKey(state: State) {
  return state.join("|");
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
