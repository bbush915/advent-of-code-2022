import * as fs from "fs";

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

  let totalScore = 0;

  for (const round of strategyGuide) {
    const opponent = ChoiceMap[round[0] as keyof typeof ChoiceMap];
    const mine = ChoiceMap[round[1] as keyof typeof ChoiceMap];

    totalScore += <number>mine + 1 + toResult(opponent, mine);
  }

  return totalScore;
}

export function part2() {
  const strategyGuide = parseInput();

  let totalScore = 0;

  for (const round of strategyGuide) {
    const opponent = ChoiceMap[round[0] as keyof typeof ChoiceMap];
    const result = ResultMap[round[1] as keyof typeof ResultMap];

    const mine = fromResult(opponent, result);

    totalScore += mine + 1 + <number>result;
  }

  return totalScore;
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
