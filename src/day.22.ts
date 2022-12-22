import fs from "fs";
import { clone } from "./utils/common";
import { Segment } from "./utils/geometry";

enum Facing {
  RIGHT,
  DOWN,
  LEFT,
  UP,
}

function parseInput() {
  const parts = fs
    .readFileSync("src/day.22.input.txt")
    .toString()
    .split("\n\n");

  const lines = parts[0].split("\n");

  const width = lines[0].length;
  const height = lines.length;

  const map = [...new Array(height)].map(() => new Array(width).fill(" "));

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      map[i][j] = lines[i][j];
    }
  }

  const directions = parts[1]
    .match(/\d+|[LR]/g)!
    .map((x, i) => (i % 2 === 0 ? Number(x) : x));

  return {
    map,
    directions,
  };
}

export function part1() {
  const input = parseInput();
  const output = clone(input.map);

  let x = 0;
  let y = input.map[0].findIndex((x) => x !== " ");
  let facing = Facing.RIGHT;

  apply(output, x, y, facing);

  for (const direction of input.directions) {
    if (typeof direction === "number") {
      outer: for (let n = 0; n < direction; n++) {
        switch (facing) {
          case Facing.RIGHT: {
            let newY = y + 1;

            if (newY > input.map[x].length - 1 || input.map[x][newY] === " ") {
              for (let m = 0; m < y; m++) {
                if (input.map[x][m] !== " ") {
                  newY = m;
                  break;
                }
              }
            }

            if (input.map[x][newY] === "#") {
              break outer;
            }

            y = newY;

            break;
          }

          case Facing.LEFT: {
            let newY = y - 1;

            if (newY < 0 || input.map[x][newY] === " ") {
              for (let m = input.map[x].length - 1; m > y; m--) {
                if (input.map[x][m] !== " ") {
                  newY = m;
                  break;
                }
              }
            }

            if (input.map[x][newY] === "#") {
              break outer;
            }

            y = newY;

            break;
          }

          case Facing.DOWN: {
            let newX = x + 1;

            if (newX > input.map.length - 1 || input.map[newX][y] === " ") {
              for (let m = 0; m < x; m++) {
                if (input.map[m][y] !== " ") {
                  newX = m;
                  break;
                }
              }
            }

            if (input.map[newX][y] === "#") {
              break outer;
            }

            x = newX;

            break;
          }

          case Facing.UP: {
            let newX = x - 1;

            if (newX < 0 || input.map[newX][y] === " ") {
              for (let m = input.map.length - 1; m > x; m--) {
                if (input.map[m][y] !== " ") {
                  newX = m;
                  break;
                }
              }
            }

            if (input.map[newX][y] === "#") {
              break outer;
            }

            x = newX;

            break;
          }
        }

        apply(output, x, y, facing);
      }
    } else {
      facing = (facing + (direction === "R" ? 1 : 3)) % 4;
      apply(output, x, y, facing);
    }
  }

  return 1000 * (x + 1) + 4 * (y + 1) + facing;
}

function apply(output: string[][], x: number, y: number, facing: Facing) {
  switch (facing) {
    case Facing.RIGHT: {
      output[x][y] = ">";
      break;
    }

    case Facing.LEFT: {
      output[x][y] = "<";
      break;
    }

    case Facing.UP: {
      output[x][y] = "^";
      break;
    }

    case Facing.DOWN: {
      output[x][y] = "v";
      break;
    }
  }
}
export function part2() {
  const input = parseInput();

  const edges: Segment[] = [
    { a: { x: 0, y: 50 }, b: { x: 0, y: 99 } }, // 0
    { a: { x: 0, y: 100 }, b: { x: 0, y: 149 } }, // 1
    { a: { x: 0, y: 50 }, b: { x: 49, y: 50 } }, // 2
    { a: { x: 0, y: 149 }, b: { x: 49, y: 149 } }, // 3
    { a: { x: 49, y: 100 }, b: { x: 49, y: 149 } }, // 4
    { a: { x: 50, y: 50 }, b: { x: 99, y: 50 } }, // 5
    { a: { x: 50, y: 99 }, b: { x: 99, y: 99 } }, // 6
    { a: { x: 100, y: 0 }, b: { x: 100, y: 49 } }, // 7
    { a: { x: 100, y: 0 }, b: { x: 149, y: 0 } }, // 8
    { a: { x: 100, y: 99 }, b: { x: 149, y: 99 } }, // 9
    { a: { x: 149, y: 50 }, b: { x: 149, y: 99 } }, // 10
    { a: { x: 150, y: 0 }, b: { x: 199, y: 0 } }, // 11
    { a: { x: 150, y: 49 }, b: { x: 199, y: 49 } }, // 12
    { a: { x: 199, y: 0 }, b: { x: 199, y: 49 } }, // 13
  ];

  const edgeMapping: Record<number, [number, Facing, Facing, boolean]> = {
    0: [11, Facing.UP, Facing.RIGHT, false],
    11: [0, Facing.LEFT, Facing.DOWN, false],

    1: [13, Facing.UP, Facing.UP, false],
    13: [1, Facing.DOWN, Facing.DOWN, false],

    2: [8, Facing.LEFT, Facing.RIGHT, true],
    8: [2, Facing.LEFT, Facing.RIGHT, true],

    3: [9, Facing.RIGHT, Facing.LEFT, true],
    9: [3, Facing.RIGHT, Facing.LEFT, true],

    4: [6, Facing.DOWN, Facing.LEFT, false],
    6: [4, Facing.RIGHT, Facing.UP, false],

    5: [7, Facing.LEFT, Facing.DOWN, false],
    7: [5, Facing.UP, Facing.RIGHT, false],

    10: [12, Facing.DOWN, Facing.LEFT, false],
    12: [10, Facing.RIGHT, Facing.UP, false],
  };

  let x = 0;
  let y = input.map[0].findIndex((x) => x !== " ");
  let facing = Facing.RIGHT;

  for (const direction of input.directions) {
    const output = clone(input.map);

    if (typeof direction === "number") {
      outer: for (let n = 0; n < direction; n++) {
        switch (facing) {
          case Facing.RIGHT: {
            let newX = x;
            let newY = y + 1;
            let newFacing: Facing = facing;

            if (newY > input.map[x].length - 1 || input.map[x][newY] === " ") {
              const currentEdgeIndex = getMatchingEdges(
                edges,
                edgeMapping,
                x,
                y,
                facing
              );
              const currentEdge = edges[currentEdgeIndex];

              const mappedEdge = edgeMapping[currentEdgeIndex];

              if (mappedEdge) {
                const [index, from, to, reverse] = mappedEdge;
                const newEdge = edges[index];

                const t = reverse ? currentEdge.b.x - x : x - currentEdge.a.x;

                const isHorizontal = newEdge.b.x - newEdge.a.x === 0;

                newX = newEdge.a.x + (isHorizontal ? 0 : t);
                newY = newEdge.a.y + (isHorizontal ? t : 0);
                newFacing = to;
              }
            }

            if (input.map[newX][newY] === "#") {
              break outer;
            }

            x = newX;
            y = newY;
            facing = newFacing;

            break;
          }

          case Facing.LEFT: {
            let newX = x;
            let newY = y - 1;
            let newFacing: Facing = facing;

            if (newY < 0 || input.map[x][newY] === " ") {
              const currentEdgeIndex = getMatchingEdges(
                edges,
                edgeMapping,
                x,
                y,
                facing
              );
              const currentEdge = edges[currentEdgeIndex];

              const mappedEdge = edgeMapping[currentEdgeIndex];

              if (mappedEdge) {
                const [index, from, to, reverse] = mappedEdge;
                const newEdge = edges[index];

                const t = reverse ? currentEdge.b.x - x : x - currentEdge.a.x;
                const isHorizontal = newEdge.b.x - newEdge.a.x === 0;

                newX = newEdge.a.x + (isHorizontal ? 0 : t);
                newY = newEdge.a.y + (isHorizontal ? t : 0);
                newFacing = to;
              }
            }

            if (input.map[newX][newY] === "#") {
              break outer;
            }

            x = newX;
            y = newY;
            facing = newFacing;

            break;
          }

          case Facing.DOWN: {
            let newX = x + 1;
            let newY = y;
            let newFacing: Facing = facing;

            if (newX > input.map.length - 1 || input.map[newX][y] === " ") {
              const currentEdgeIndex = getMatchingEdges(
                edges,
                edgeMapping,
                x,
                y,
                facing
              );
              const currentEdge = edges[currentEdgeIndex];

              const mappedEdge = edgeMapping[currentEdgeIndex];

              if (mappedEdge) {
                const [index, from, to, reverse] = mappedEdge;
                const newEdge = edges[index];

                const t = reverse ? currentEdge.b.y - y : y - currentEdge.a.y;
                const isHorizontal = newEdge.b.x - newEdge.a.x === 0;

                newX = newEdge.a.x + (isHorizontal ? 0 : t);
                newY = newEdge.a.y + (isHorizontal ? t : 0);
                newFacing = to;
              }
            }

            if (input.map[newX][newY] === "#") {
              break outer;
            }

            x = newX;
            y = newY;
            facing = newFacing;

            break;
          }

          case Facing.UP: {
            let newX = x - 1;
            let newY = y;
            let newFacing: Facing = facing;

            if (newX < 0 || input.map[newX][y] === " ") {
              const currentEdgeIndex = getMatchingEdges(
                edges,
                edgeMapping,
                x,
                y,
                facing
              );
              const currentEdge = edges[currentEdgeIndex];

              const mappedEdge = edgeMapping[currentEdgeIndex];

              if (mappedEdge) {
                const [index, from, to, reverse] = mappedEdge;
                const newEdge = edges[index];

                const t = reverse ? currentEdge.b.y - y : y - currentEdge.a.y;
                const isHorizontal = newEdge.b.x - newEdge.a.x === 0;

                newX = newEdge.a.x + (isHorizontal ? 0 : t);
                newY = newEdge.a.y + (isHorizontal ? t : 0);
                newFacing = to;
              }
            }

            if (input.map[newX][newY] === "#") {
              break outer;
            }

            x = newX;
            y = newY;
            facing = newFacing;

            break;
          }
        }

        apply(output, x, y, facing);
      }
    } else {
      facing = (facing + (direction === "R" ? 1 : 3)) % 4;
      apply(output, x, y, facing);
    }

    // console.log(output.map((x) => x.join("")).join("\n"));
  }

  return 1000 * (x + 1) + 4 * (y + 1) + facing;
}

function getMatchingEdges(
  edges: Segment[],
  edgeMapping: Record<number, [number, Facing, Facing, boolean]>,
  x: number,
  y: number,
  facing: Facing
) {
  const matchingEdges = edges.filter((edge, i) => {
    if (edgeMapping[i][1] !== facing) {
      return false;
    }

    if (edge.a.x === edge.b.x) {
      return x === edge.a.x && y >= edge.a.y && y <= edge.b.y;
    } else {
      return y === edge.a.y && x >= edge.a.x && x <= edge.b.x;
    }
  });

  return edges.findIndex((edge) => edge === matchingEdges[0]);
}
