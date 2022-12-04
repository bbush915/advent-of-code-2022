import * as fs from "fs";

import { part1, part2 } from "./day.3";

describe("Day 2", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the example", function () {
      const input = fs.readFileSync("./src/day.3.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(157);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(7889);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the example", function () {
      const input = fs.readFileSync("./src/day.3.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(70);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(2825);
    });
  });
});
