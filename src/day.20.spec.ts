import fs from "fs";

import { part1, part2 } from "./day.20";

describe("Day 20", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    // it("should calculate the correct answer for the first example", function () {
    //   const input = fs.readFileSync("./src/day.20.example.1.txt");
    //   jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

    //   const answer = part1();

    //   expect(answer).toBe(0);
    // });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(0);
    });
  });

  describe("Part 2", function () {
    // it("should calculate the correct answer for the first example", function () {
    //   const input = fs.readFileSync("./src/day.20.example.1.txt");
    //   jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

    //   const answer = part2();

    //   expect(answer).toBe(0);
    // });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(0);
    });
  });
});
