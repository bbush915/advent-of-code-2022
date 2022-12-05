import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.2.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" "));
}

export function part1() {
  const strategyGuide = parseInput();

  return strategyGuide.reduce((totalScore, round) => {
    const opponent = ChoiceMap[round[0] as keyof typeof ChoiceMap];
    const mine = ChoiceMap[round[1] as keyof typeof ChoiceMap];

    return totalScore + <number>mine + 1 + toResult(opponent, mine);
  }, 0);
}

export function part2() {
  const strategyGuide = parseInput();

  return strategyGuide.reduce((totalScore, round) => {
    const opponent = ChoiceMap[round[0] as keyof typeof ChoiceMap];
    const result = ResultMap[round[1] as keyof typeof ResultMap];

    return totalScore + fromResult(opponent, result) + 1 + <number>result;
  }, 0);
}

enum Choices {
  Rock = 0,
  Paper = 1,
  Scissors = 2,
}

const ChoiceMap = {
  A: Choices.Rock,
  X: Choices.Rock,

  B: Choices.Paper,
  Y: Choices.Paper,

  C: Choices.Scissors,
  Z: Choices.Scissors,
};

enum Results {
  Loss = 0,
  Draw = 3,
  Win = 6,
}

const ResultMap = {
  X: Results.Loss,
  Y: Results.Draw,
  Z: Results.Win,
};

function toResult(opponent: Choices, mine: Choices): number {
  if (opponent === mine) {
    return Results.Draw;
  }

  if ((opponent + 1) % 3 === mine) {
    return Results.Win;
  }

  return Results.Loss;
}

function fromResult(opponent: Choices, result: Results): number {
  if (result === Results.Draw) {
    return opponent;
  }

  if (result === Results.Loss) {
    return (opponent + 2) % 3;
  }

  return (opponent + 1) % 3;
}
