export type Point = {
  x: number;
  y: number;
};

export type Segment = {
  a: Point;
  b: Point;
};

export function intersect(
  { a: { x: x1, y: y1 }, b: { x: x2, y: y2 } }: Segment,
  { a: { x: x3, y: y3 }, b: { x: x4, y: y4 } }: Segment
): Point | null {
  const D = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / D;
  const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / D;

  if (t < 0 || t > 1 || u < 0 || u > 1) {
    return null;
  }

  return {
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1),
  };
}
