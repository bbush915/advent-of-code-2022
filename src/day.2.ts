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

  let totalScore = 0;

  for (const round of strategyGuide) {
    const opponent = parseChoice(round[0])!;
    const mine = parseChoice(round[1])!;

    totalScore += (mine as number) + 1 + (toResult(opponent, mine) as number);
  }

  return totalScore;
}

export function part2() {
  const strategyGuide = parseInput();

  let totalScore = 0;

  for (const round of strategyGuide) {
    const opponent = parseChoice(round[0])!;
    const result = parseResult(round[1])!;

    const mine = fromResult(opponent, result);

    totalScore += (mine as number) + 1 + (result as number);
  }

  return totalScore;
}

enum Choices {
  Rock = 0,
  Paper = 1,
  Scissors = 2,
}

enum Results {
  Loss = 0,
  Draw = 3,
  Win = 6,
}

function parseChoice(value: string): Choices | null {
  switch (value) {
    case "A":
    case "X": {
      return Choices.Rock;
    }

    case "B":
    case "Y": {
      return Choices.Paper;
    }

    case "C":
    case "Z": {
      return Choices.Scissors;
    }
  }

  return null;
}

function parseResult(value: string) {
  switch (value) {
    case "X": {
      return Results.Loss;
    }

    case "Y": {
      return Results.Draw;
    }

    case "Z": {
      return Results.Win;
    }
  }

  return null;
}

function toResult(opponent: Choices, mine: Choices) {
  if (opponent === mine) {
    return Results.Draw;
  }

  if (((opponent as number) + 1) % 3 === (mine as number)) {
    return Results.Win;
  }

  return Results.Loss;
}

function fromResult(opponent: Choices, result: Results) {
  if (result === Results.Draw) {
    return opponent;
  }

  if (result === Results.Loss) {
    return (((opponent as number) + 2) % 3) as Choices;
  }

  return (((opponent as number) + 1) % 3) as Choices;
}
