import { intersect, Segment } from "./geometry";

describe("utils", function () {
  describe("geometry", function () {
    describe("intersect", function () {
      it("should handle intersecting segments", function () {
        const s1: Segment = { a: { x: 1, y: 1 }, b: { x: 3, y: 2 } };
        const s2: Segment = { a: { x: 1, y: 4 }, b: { x: 2, y: -1 } };

        const intersection = intersect(s1, s2);

        expect(intersection).not.toBeNull();

        expect(intersection!.x).toBe(17 / 11);
        expect(intersection!.y).toBe(14 / 11);
      });

      it("should handle non-intersecting segments", function () {
        const s1: Segment = { a: { x: 0, y: 0 }, b: { x: 1, y: 1 } };
        const s2: Segment = { a: { x: 0, y: 1 }, b: { x: 1, y: 2 } };

        const intersection = intersect(s1, s2);

        expect(intersection).toBeNull();
      });
    });
  });
});
