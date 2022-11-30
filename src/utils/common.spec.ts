import { clone, isNumeric } from "./common";

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
    });
  });
});
