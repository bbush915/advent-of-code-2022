import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.8.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map(Number));
}

export function part1() {
  const trees = parseInput();
  const visibleTrees = getVisibleTrees(trees);

  return visibleTrees.length + 4 * (trees.length - 1);
}

export function part2() {
  const trees = parseInput();
  const visibleTrees = getVisibleTrees(trees);

  let maxScenicScore = 0;

  for (const { i, j } of visibleTrees) {
    let viewingDistanceToLeft = 0;

    for (let n = j - 1; n >= 0; n--) {
      viewingDistanceToLeft++;

      if (trees[i][n] >= trees[i][j]) {
        break;
      }
    }

    let viewingDistanceToRight = 0;

    for (let n = j + 1; n < trees[i].length; n++) {
      viewingDistanceToRight++;

      if (trees[i][n] >= trees[i][j]) {
        break;
      }
    }

    let viewingDistanceToTop = 0;

    for (let n = i - 1; n >= 0; n--) {
      viewingDistanceToTop++;

      if (trees[n][j] >= trees[i][j]) {
        break;
      }
    }

    let viewingDistanceToBottom = 0;

    for (let n = i + 1; n < trees.length; n++) {
      viewingDistanceToBottom++;

      if (trees[n][j] >= trees[i][j]) {
        break;
      }
    }

    const scenicScore =
      viewingDistanceToLeft *
      viewingDistanceToRight *
      viewingDistanceToTop *
      viewingDistanceToBottom;

    if (scenicScore > maxScenicScore) {
      maxScenicScore = scenicScore;
    }
  }

  return maxScenicScore;
}

function getVisibleTrees(trees: number[][]) {
  const visibleTrees: { i: number; j: number }[] = [];

  for (let i = 1; i < trees.length - 1; i++) {
    for (let j = 1; j < trees.length - 1; j++) {
      let visibleFromLeft = true;

      for (let n = 0; n < i; n++) {
        if (trees[n][j] >= trees[i][j]) {
          visibleFromLeft = false;
          break;
        }
      }

      let visibleFromRight = true;

      for (let n = trees.length - 1; n > i; n--) {
        if (trees[n][j] >= trees[i][j]) {
          visibleFromRight = false;
          break;
        }
      }

      let visibleFromTop = true;

      for (let n = 0; n < j; n++) {
        if (trees[i][n] >= trees[i][j]) {
          visibleFromTop = false;
          break;
        }
      }

      let visibleFromBottom = true;

      for (let n = trees[i].length - 1; n > j; n--) {
        if (trees[i][n] >= trees[i][j]) {
          visibleFromBottom = false;
          break;
        }
      }

      if (
        visibleFromLeft ||
        visibleFromRight ||
        visibleFromTop ||
        visibleFromBottom
      ) {
        visibleTrees.push({ i, j });
      }
    }
  }

  return visibleTrees;
}
