import fs from "fs";

import { clone } from "./utils/common";
import { Segment as Edge } from "./utils/geometry";

type Notes = {
  map: Tile[][];
  instructions: Instruction[];
};

type Tile = " " | "." | "#";

type Instruction = number | "L" | "R";

type Position = {
  x: number;
  y: number;
  facing: Directions;
};

type WrapStrategy = (
  map: Tile[][],
  x: number,
  y: number,
  facing: Directions
) => Position;

enum Directions {
  RIGHT,
  DOWN,
  LEFT,
  UP,
}

// NOTE - Hardcoded edges and mapping.

const EDGES: Edge[] = [
  { a: { x: 0, y: 50 }, b: { x: 0, y: 99 } },
  { a: { x: 0, y: 100 }, b: { x: 0, y: 149 } },
  { a: { x: 0, y: 50 }, b: { x: 49, y: 50 } },
  { a: { x: 0, y: 149 }, b: { x: 49, y: 149 } },
  { a: { x: 49, y: 100 }, b: { x: 49, y: 149 } },
  { a: { x: 50, y: 50 }, b: { x: 99, y: 50 } },
  { a: { x: 50, y: 99 }, b: { x: 99, y: 99 } },
  { a: { x: 100, y: 0 }, b: { x: 100, y: 49 } },
  { a: { x: 100, y: 0 }, b: { x: 149, y: 0 } },
  { a: { x: 100, y: 99 }, b: { x: 149, y: 99 } },
  { a: { x: 149, y: 50 }, b: { x: 149, y: 99 } },
  { a: { x: 150, y: 0 }, b: { x: 199, y: 0 } },
  { a: { x: 150, y: 49 }, b: { x: 199, y: 49 } },
  { a: { x: 199, y: 0 }, b: { x: 199, y: 49 } },
];

const EDGE_WRAPPING: Record<number, [number, Directions, Directions, boolean]> =
  {
    0: [11, Directions.UP, Directions.RIGHT, false],
    1: [13, Directions.UP, Directions.UP, false],
    2: [8, Directions.LEFT, Directions.RIGHT, true],
    3: [9, Directions.RIGHT, Directions.LEFT, true],
    4: [6, Directions.DOWN, Directions.LEFT, false],
    5: [7, Directions.LEFT, Directions.DOWN, false],
    6: [4, Directions.RIGHT, Directions.UP, false],
    7: [5, Directions.UP, Directions.RIGHT, false],
    8: [2, Directions.LEFT, Directions.RIGHT, true],
    9: [3, Directions.RIGHT, Directions.LEFT, true],
    10: [12, Directions.DOWN, Directions.LEFT, false],
    11: [0, Directions.LEFT, Directions.DOWN, false],
    12: [10, Directions.RIGHT, Directions.UP, false],
    13: [1, Directions.DOWN, Directions.DOWN, false],
  };

function parseInput(): Notes {
  const parts = fs
    .readFileSync("src/day.22.input.txt")
    .toString()
    .split("\n\n");

  const map = parseMap(parts[0]);

  const instructions = parts[1]
    .match(/\d+|[LR]/g)!
    .map((x, i) => (i % 2 === 0 ? Number(x) : x) as Instruction);

  return {
    map,
    instructions,
  };
}

function parseMap(part: string) {
  const lines = part.split("\n");

  // NOTE - Lines are not padded to the full width, so we do that here.

  const height = lines.length;
  const width = lines[0].length;

  const map = [...new Array<Tile>(height)].map(() =>
    new Array<Tile>(width).fill(" ")
  );

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      map[i][j] = lines[i][j] as Tile;
    }
  }

  return map;
}

export function part1() {
  const notes = parseInput();
  const finalPosition = executeInstructions(notes, flatWrappingStrategy);

  return getPassword(finalPosition);
}

export function part2() {
  const notes = parseInput();
  const finalPosition = executeInstructions(notes, cubeWrappingStrategy);

  return getPassword(finalPosition);
}

function getEdge({ x, y, facing }: Position) {
  return EDGES.filter((edge, i) => {
    // NOTE - We could have multiple matches on corners, so filter by the
    // direction we are facing.

    if (EDGE_WRAPPING[i][1] !== facing) {
      return false;
    }

    // NOTE - Handle horizontal vs vertical edge.

    if (edge.a.x === edge.b.x) {
      return x === edge.a.x && y >= edge.a.y && y <= edge.b.y;
    } else {
      return y === edge.a.y && x >= edge.a.x && x <= edge.b.x;
    }
  })[0];
}

function executeInstructions(
  { map, instructions }: Notes,
  handleWrap: WrapStrategy
) {
  const position = {
    x: 0,
    y: map[0].findIndex((x) => x !== " "),
    facing: Directions.RIGHT,
  };

  for (const instruction of instructions) {
    if (typeof instruction === "number") {
      for (let n = 0; n < instruction; n++) {
        if (!tryMoveForward(map, position, handleWrap)) {
          break;
        }
      }
    } else {
      position.facing = (position.facing + (instruction === "R" ? 1 : 3)) % 4;
    }
  }

  return position;
}

function tryMoveForward(
  map: Tile[][],
  position: Position,
  handleWrap: WrapStrategy
) {
  let x = position.x;
  let y = position.y;
  let facing = position.facing;

  switch (position.facing) {
    case Directions.RIGHT: {
      y += 1;

      if (y > map[x].length - 1 || map[x][y] === " ") {
        const wrappedPosition = handleWrap(map, x, position.y, facing);

        x = wrappedPosition.x;
        y = wrappedPosition.y;
        facing = wrappedPosition.facing;
      }

      break;
    }

    case Directions.DOWN: {
      x += 1;

      if (x > map.length - 1 || map[x][y] === " ") {
        const wrappedPosition = handleWrap(map, position.x, y, facing);

        x = wrappedPosition.x;
        y = wrappedPosition.y;
        facing = wrappedPosition.facing;
      }

      break;
    }

    case Directions.LEFT: {
      y -= 1;

      if (y < 0 || map[x][y] === " ") {
        const wrappedPosition = handleWrap(map, x, position.y, facing);

        x = wrappedPosition.x;
        y = wrappedPosition.y;
        facing = wrappedPosition.facing;
      }

      break;
    }

    case Directions.UP: {
      x -= 1;

      if (x < 0 || map[x][y] === " ") {
        const wrappedPosition = handleWrap(map, position.x, y, facing);

        x = wrappedPosition.x;
        y = wrappedPosition.y;
        facing = wrappedPosition.facing;
      }

      break;
    }
  }

  if (map[x][y] === "#") {
    return false;
  }

  position.x = x;
  position.y = y;
  position.facing = facing;

  return true;
}

function flatWrappingStrategy(
  map: Tile[][],
  x: number,
  y: number,
  facing: Directions
) {
  let wrappedPosition: Position = {
    x,
    y,
    facing,
  };

  switch (facing) {
    case Directions.RIGHT: {
      for (let n = 0; n < y; n++) {
        if (map[x][n] !== " ") {
          wrappedPosition.y = n;
          break;
        }
      }

      break;
    }

    case Directions.DOWN: {
      for (let n = 0; n < x; n++) {
        if (map[n][y] !== " ") {
          wrappedPosition.x = n;
          break;
        }
      }

      break;
    }

    case Directions.LEFT: {
      for (let n = map[x].length - 1; n > y; n--) {
        if (map[x][n] !== " ") {
          wrappedPosition.y = n;
          break;
        }
      }

      break;
    }

    case Directions.UP: {
      for (let n = map.length - 1; n > x; n--) {
        if (map[n][y] !== " ") {
          wrappedPosition.x = n;
          break;
        }
      }

      break;
    }
  }

  return wrappedPosition;
}

function cubeWrappingStrategy(
  _map: Tile[][],
  x: number,
  y: number,
  facing: Directions
) {
  let wrappedPosition: Position = {
    x,
    y,
    facing,
  };

  const edge = getEdge(wrappedPosition);

  const edgeWrapping = EDGE_WRAPPING[EDGES.indexOf(edge)];
  const [edgeIndex, , to, reverse] = edgeWrapping;

  const wrappedEdge = EDGES[edgeIndex];

  let t: number;

  switch (facing) {
    case Directions.RIGHT:
    case Directions.LEFT: {
      t = reverse ? edge.b.x - x : x - edge.a.x;
      break;
    }

    case Directions.UP:
    case Directions.DOWN: {
      t = reverse ? edge.b.y - y : y - edge.a.y;
      break;
    }
  }

  const isHorizontal = wrappedEdge.b.x - wrappedEdge.a.x === 0;

  wrappedPosition.x = wrappedEdge.a.x + (isHorizontal ? 0 : t);
  wrappedPosition.y = wrappedEdge.a.y + (isHorizontal ? t : 0);
  wrappedPosition.facing = to;

  return wrappedPosition;
}

function getPassword({ x, y, facing }: Position) {
  return 1000 * (x + 1) + 4 * (y + 1) + facing;
}
