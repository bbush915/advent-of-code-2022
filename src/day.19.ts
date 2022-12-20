import fs, { stat } from "fs";

import { clone } from "./utils/common";

type Blueprint = number[][];

type State = {
  robots: number[];
  resources: number[];
  time: number;
};

enum Resources {
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
    .slice(0, 3)
    .map((blueprint, i) =>
      getMaxGeodeCount(
        blueprint,
        24,
        {
          resources: [0, 0, 0, 0],
          robots: [1, 0, 0, 0],
          time: 0,
        },
        new Map<string, number>()
      )
    )
    .reduce((product, qualityLevel) => product * qualityLevel, 1);
}

export function part2() {
  return 0;
}

let best = 0;

function getMaxGeodeCount(
  blueprint: Blueprint,
  timeLimit: number,
  state: State,
  table: Map<string, number>
): number {
  if (state.time === timeLimit) {
    if (state.resources[Resources.GEODE] > best) {
      best = state.resources[Resources.GEODE];
      console.log(state.resources[Resources.GEODE]);
    }

    return state.resources[Resources.GEODE];
  }

  const geodeCounts = getPossibleDecisions(blueprint, state.resources).map(
    (decision) => {
      const decisionState = clone(state);

      decisionState.time++;

      for (let i = 0; i < 4; i++) {
        decisionState.resources[i] += decisionState.robots[i];
      }

      switch (decision) {
        case Decisions.BUILD_ORE_ROBOT: {
          decisionState.robots[Resources.ORE]++;

          decisionState.resources[Resources.ORE] -=
            blueprint[Resources.ORE][Resources.ORE];

          break;
        }

        case Decisions.BUILD_CLAY_ROBOT: {
          decisionState.robots[Resources.CLAY]++;

          decisionState.resources[Resources.ORE] -=
            blueprint[Resources.CLAY][Resources.ORE];

          break;
        }

        case Decisions.BUILD_OBSIDIAN_ROBOT: {
          decisionState.robots[Resources.OBSIDIAN]++;

          decisionState.resources[Resources.ORE] -=
            blueprint[Resources.OBSIDIAN][Resources.ORE];
          decisionState.resources[Resources.CLAY] -=
            blueprint[Resources.OBSIDIAN][Resources.CLAY];

          break;
        }

        case Decisions.BUILD_GEODE_ROBOT: {
          decisionState.robots[Resources.GEODE]++;

          decisionState.resources[Resources.ORE] -=
            blueprint[Resources.GEODE][Resources.ORE];
          decisionState.resources[Resources.OBSIDIAN] -=
            blueprint[Resources.GEODE][Resources.OBSIDIAN];

          break;
        }
      }

      return getMaxGeodeCount(blueprint, timeLimit, decisionState, table);
    }
  );

  return Math.max(...geodeCounts);
}

type StateV2 = number[];

function getMaxGeodeCountV2(
  blueprint: Blueprint,
  timeLimit: number,
  initialState: StateV2
) {
  let states = new Set<string>([toKey(initialState)]);

  for (let i = 0; i < timeLimit; i++) {
    let newStates = new Set<string>();
    let maxGeodes = 0;

    for (const key of states.values()) {
      const state = fromKey(key);

      const decisionStates = getPossibleDecisions(
        blueprint,
        state.slice(4)
      ).map((decision) => {
        const decisionState = clone(state);

        for (let i = 0; i < 4; i++) {
          decisionState[i + 4] += decisionState[i];
        }

        switch (decision) {
          case Decisions.BUILD_ORE_ROBOT: {
            decisionState[Resources.ORE]++;

            decisionState[Resources.ORE + 4] -=
              blueprint[Resources.ORE][Resources.ORE];

            break;
          }

          case Decisions.BUILD_CLAY_ROBOT: {
            decisionState[Resources.CLAY]++;

            decisionState[Resources.ORE + 4] -=
              blueprint[Resources.CLAY][Resources.ORE];

            break;
          }

          case Decisions.BUILD_OBSIDIAN_ROBOT: {
            decisionState[Resources.OBSIDIAN]++;

            decisionState[Resources.ORE + 4] -=
              blueprint[Resources.OBSIDIAN][Resources.ORE];
            decisionState[Resources.CLAY + 4] -=
              blueprint[Resources.OBSIDIAN][Resources.CLAY];

            break;
          }

          case Decisions.BUILD_GEODE_ROBOT: {
            decisionState[Resources.GEODE]++;

            decisionState[Resources.ORE + 4] -=
              blueprint[Resources.GEODE][Resources.ORE];
            decisionState[Resources.OBSIDIAN + 4] -=
              blueprint[Resources.GEODE][Resources.OBSIDIAN];

            break;
          }
        }

        return decisionState;
      });

      const decisionMaxGeodes = Math.max(
        ...decisionStates.map((x) => x[Resources.GEODE + 4])
      );

      for (const decisionState of decisionStates) {
        newStates.add(toKey(decisionState));
      }

      if (decisionMaxGeodes > maxGeodes) {
        // newStates = newStates.filter(
        //   (x) => x.resources[Resources.GEODE] >= maxGeodes
        // );

        maxGeodes = decisionMaxGeodes;
      }
    }

    states = new Set(
      [...newStates]
        .map((x) => fromKey(x))
        .filter((x) => x[Resources.GEODE + 4] === maxGeodes)
        .map((x) => toKey(x))
    );

    console.log(i, maxGeodes, states.size);
  }

  const [val] = states;

  return fromKey(val)[Resources.GEODE + 4];
}

function getPossibleDecisions(blueprint: Blueprint, resources: number[]) {
  const decisions = [Decisions.WAIT];

  // NOTE - Ore

  const oreCosts = blueprint[Resources.ORE];

  if (resources[Resources.ORE] >= oreCosts[Resources.ORE]) {
    decisions.push(Decisions.BUILD_ORE_ROBOT);
  }

  // NOTE - Clay

  const clayCosts = blueprint[Resources.CLAY];

  if (resources[Resources.ORE] >= clayCosts[Resources.ORE]) {
    decisions.push(Decisions.BUILD_CLAY_ROBOT);
  }

  // NOTE - Obsidian

  const obsidianCosts = blueprint[Resources.OBSIDIAN];

  if (
    resources[Resources.ORE] >= obsidianCosts[Resources.ORE] &&
    resources[Resources.CLAY] >= obsidianCosts[Resources.CLAY]
  ) {
    decisions.push(Decisions.BUILD_OBSIDIAN_ROBOT);
  }

  // NOTE - Geode

  const geodeCosts = blueprint[Resources.GEODE];

  if (
    resources[Resources.ORE] >= geodeCosts[Resources.ORE] &&
    resources[Resources.OBSIDIAN] >= geodeCosts[Resources.OBSIDIAN]
  ) {
    decisions.push(Decisions.BUILD_GEODE_ROBOT);
  }

  return decisions.reverse();
}

function toKey(state: StateV2) {
  return state.join("|");
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
