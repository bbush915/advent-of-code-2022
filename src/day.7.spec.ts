import fs from "fs";

import { part1, part2 } from "./day.7";

describe("Day 7", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the example", function () {
      const input = fs.readFileSync("./src/day.7.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(95437);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(1477771);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the example", function () {
      const input = fs.readFileSync("./src/day.7.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(24933642);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(3579501);
    });
  });
});
