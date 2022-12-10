import fs from "fs";

import { part1, part2 } from "./day.5";

describe("Day 5", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.5.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe("CMZ");
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe("VGBBJCRMN");
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.5.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe("MCD");
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe("LBBVJBRMH");
    });
  });
});
