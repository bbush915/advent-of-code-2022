import fs from "fs";

import { part1, part2 } from "./day.1";

describe("Day 1", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the same answer as the example", function () {
      const input = fs.readFileSync("./src/day.1.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(24000);
    });
  });

  describe("Part 2", function () {
    it("should calculate the same answer as the example", function () {
      const input = fs.readFileSync("./src/day.1.example.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(45000);
    });
  });
});
