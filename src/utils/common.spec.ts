import { cartesian, clone, isNumeric } from "./common";

describe("utils", function () {
  describe("common", function () {
    describe("clone", function () {
      it("should not modify the original object after cloning", function () {
        const originalArray = [1, 2, 3];

        const clonedArray = clone(originalArray);
        clonedArray.push(4);

        expect(originalArray.length).toBe(3);
      });
    });

    describe("isNumeric", function () {
      it("should handle a string", function () {
        expect(isNumeric("hello")).toBeFalsy();
      });

      it("should handle a number", function () {
        expect(isNumeric(3)).toBeTruthy();
      });

      it("should handle an array of size 1", function () {
        expect(isNumeric([3])).toBeFalsy();
      });

      it("should handle an array of size 2", function () {
        expect(isNumeric([3, 4])).toBeFalsy();
      });
    });

    describe("cartesian", function () {
      it("should calculate the cartesian product of a single array with a single item", function () {
        expect(cartesian([1])).toEqual([[1]]);
      });

      it("should calculate the cartesian product of a single array with multiple items", function () {
        expect(cartesian([1, 2])).toEqual([[1], [2]]);
      });

      it("should calculate the cartesian product of two numeric arrays", function () {
        expect(cartesian([1, 2], [3, 4])).toEqual([
          [1, 3],
          [1, 4],
          [2, 3],
          [2, 4],
        ]);
      });

      it("should calculate the cartesian product of two mixed arrays", function () {
        expect(cartesian([1, "a"], [2, "b"])).toEqual([
          [1, 2],
          [1, "b"],
          ["a", 2],
          ["a", "b"],
        ]);
      });

      it("should calculate the cartesian product of three numeric arrays", function () {
        expect(cartesian([1, 2], [3, 4], [5, 6])).toEqual([
          [1, 3, 5],
          [1, 3, 6],
          [1, 4, 5],
          [1, 4, 6],
          [2, 3, 5],
          [2, 3, 6],
          [2, 4, 5],
          [2, 4, 6],
        ]);
      });
    });
  });
});
