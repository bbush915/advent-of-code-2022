import fs from "fs";

import { part1, part2 } from "./day.6";

describe("Day 6", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.6.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(7);
    });

    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync("./src/day.6.example.2.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(5);
    });

    it("should calculate the correct answer for the third example", function () {
      const input = fs.readFileSync("./src/day.6.example.3.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(6);
    });

    it("should calculate the correct answer for the fourth example", function () {
      const input = fs.readFileSync("./src/day.6.example.4.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(10);
    });

    it("should calculate the correct answer for the fifth example", function () {
      const input = fs.readFileSync("./src/day.6.example.5.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(11);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(1142);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.6.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(19);
    });

    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync("./src/day.6.example.2.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(23);
    });

    it("should calculate the correct answer for the third example", function () {
      const input = fs.readFileSync("./src/day.6.example.3.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(23);
    });

    it("should calculate the correct answer for the fourth example", function () {
      const input = fs.readFileSync("./src/day.6.example.4.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(29);
    });

    it("should calculate the correct answer for the fifth example", function () {
      const input = fs.readFileSync("./src/day.6.example.5.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(26);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(2803);
    });
  });
});
