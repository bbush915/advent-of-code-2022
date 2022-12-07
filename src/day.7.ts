import fs from "fs";

interface Node {
  parent: Node | null;
  children: Record<string, number | Node>;
}

function parseInput() {
  const output = fs
    .readFileSync("src/day.7.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" "));

  const root: Node = { parent: null, children: {} };
  let workingDirectory = root;

  for (let i = 0; i < output.length; i++) {
    switch (output[i][1]) {
      case "cd": {
        if (output[i][2] === "..") {
          if (workingDirectory.parent) {
            workingDirectory = workingDirectory.parent;
          }
        } else if (output[i][2] === "/") {
          workingDirectory = root;
        } else {
          workingDirectory = workingDirectory.children[output[i][2]] as Node;
        }

        break;
      }

      case "ls": {
        while (i + 1 < output.length && output[i + 1][0] !== "$") {
          if (output[i + 1][0] === "dir") {
            workingDirectory.children[output[i + 1][1]] = {
              parent: workingDirectory,
              children: {},
            };
          } else {
            workingDirectory.children[output[i + 1][1]] = Number(
              output[i + 1][0]
            );
          }

          i++;
        }

        break;
      }
    }
  }

  const directorySizes: Record<string, number> = {};
  populateDirectorySizes(directorySizes, root, "/");

  return directorySizes;
}

function populateDirectorySizes(
  directorySizes: Record<string, number>,
  directoryOrSize: Node | number,
  name: string,
  path: string = ""
) {
  if (typeof directoryOrSize === "number") {
    return directoryOrSize;
  }

  const key = `${path}${name}`;

  directorySizes[key] = Object.entries(directoryOrSize.children).reduce(
    (size, child) =>
      size + populateDirectorySizes(directorySizes, child[1], child[0], key),
    0
  );

  return directorySizes[key];
}

export function part1() {
  const directorySizes = parseInput();

  return Object.values(directorySizes)
    .filter((x) => x < 100000)
    .reduce((totalSize, size) => totalSize + size, 0);
}

export function part2() {
  const directorySizes = parseInput();

  const unusedSpace = 70000000 - directorySizes["/"];

  return Object.values(directorySizes)
    .filter((x) => x > 30000000 - unusedSpace)
    .sort((x, y) => x - y)[0];
}
