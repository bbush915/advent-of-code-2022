import fs from "fs";

import { part1, part2 } from "./day.2";

describe("Day 2", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the same answer as the example", function () {
      const input = fs.readFileSync("./src/day.2.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(15);
    });
  });

  describe("Part 2", function () {
    it("should calculate the same answer as the example", function () {
      const input = fs.readFileSync("./src/day.2.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(12);
    });
  });
});