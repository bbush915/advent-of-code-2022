import fs from "fs";

import { isNumeric } from "./utils/common";

function parseInput() {
  return fs
    .readFileSync("src/day.7.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" "));
}

export function part1() {
  const commands = parseInput();

  let root: any = { "/": { parent: null, children: {} } };
  let workingDirectory: any;

  for (let i = 0; i < commands.length; i++) {
    switch (commands[i][1]) {
      case "cd": {
        if (commands[i][2] === "..") {
          if (workingDirectory.parent) {
            workingDirectory = workingDirectory.parent;
          }
        } else if (commands[i][2] === "/") {
          workingDirectory = root["/"];
        } else {
          workingDirectory = workingDirectory.children[commands[i][2]];
        }
        break;
      }

      case "ls": {
        while (i + 1 < commands.length && commands[i + 1][0] !== "$") {
          if (commands[i + 1][0] === "dir") {
            workingDirectory.children[commands[i + 1][1]] = {
              parent: workingDirectory,
              children: {},
            };
          } else {
            workingDirectory.children[commands[i + 1][1]] = Number(
              commands[i + 1][0]
            );
          }

          i++;
        }

        break;
      }
    }
  }

  const directorySizes: Record<string, number> = {};

  calculateSizes(directorySizes, root["/"], "/");

  return Object.values(directorySizes)
    .filter((x) => x < 100000)
    .reduce((sum, size) => sum + size, 0);
}

function calculateSizes(
  directorySizes: Record<string, number>,
  sizeOrDirectory: any,
  name: string,
  path: string = ""
) {
  if (isNumeric(sizeOrDirectory)) {
    return sizeOrDirectory;
  }

  const newPath = `${path}/${name}`;

  directorySizes[newPath] = Object.entries(sizeOrDirectory.children).reduce(
    (size: number, child: any) =>
      size + calculateSizes(directorySizes, child[1], child[0], newPath),
    0
  );

  return directorySizes[newPath];
}

export function part2() {
  const commands = parseInput();

  let root: any = { "/": { parent: null, children: {} } };
  let workingDirectory: any;

  for (let i = 0; i < commands.length; i++) {
    switch (commands[i][1]) {
      case "cd": {
        if (commands[i][2] === "..") {
          if (workingDirectory.parent) {
            workingDirectory = workingDirectory.parent;
          }
        } else if (commands[i][2] === "/") {
          workingDirectory = root["/"];
        } else {
          workingDirectory = workingDirectory.children[commands[i][2]];
        }
        break;
      }

      case "ls": {
        while (i + 1 < commands.length && commands[i + 1][0] !== "$") {
          if (commands[i + 1][0] === "dir") {
            workingDirectory.children[commands[i + 1][1]] = {
              parent: workingDirectory,
              children: {},
            };
          } else {
            workingDirectory.children[commands[i + 1][1]] = Number(
              commands[i + 1][0]
            );
          }

          i++;
        }

        break;
      }
    }
  }

  const directorySizes: Record<string, number> = {};

  calculateSizes(directorySizes, root["/"], "/");
  console.log(directorySizes);

  const freeSpace = 70000000 - directorySizes["//"];
  console.log(freeSpace);

  return Object.values(directorySizes)
    .filter((x) => x > 30000000 - freeSpace)
    .sort((x, y) => x - y)[0];
}
