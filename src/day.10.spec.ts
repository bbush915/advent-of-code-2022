import fs from "fs";

import { part1, part2 } from "./day.10";

describe("Day 10", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.10.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(13140);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(15360);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.10.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(
        "\n\n##..##..##..##..##..##..##..##..##..##..\n###...###...###...###...###...###...###.\n####....####....####....####....####....\n#####.....#####.....#####.....#####.....\n######......######......######......####\n#######.......#######.......#######.....\n\n"
      );
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();

      expect(answer).toBe(
        "\n\n###..#..#.#....#..#...##..##..####..##..\n#..#.#..#.#....#..#....#.#..#....#.#..#.\n#..#.####.#....####....#.#......#..#..#.\n###..#..#.#....#..#....#.#.##..#...####.\n#....#..#.#....#..#.#..#.#..#.#....#..#.\n#....#..#.####.#..#..##...###.####.#..#.\n\n"
      );
    });
  });
});
