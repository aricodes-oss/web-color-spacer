// The entrypoint of the schema package depends on this file, so we import the
// members we need directly from their source file to avoid an import loop
import Color from '@/schema/color';
import Point from '@/schema/point';

const boundariesEqual = (lhs, rhs) => Object.keys(lhs).every(key => lhs[key] === rhs[key]);

export default function gradientColors(startingColor, baseInterval = 17) {
  /* const rows = [];

   * let i = 0;
   * let j = 0;
   * // TODO: implement orientation
   * for (; j < 400; j += baseInterval) {
   *   const points = [];
   *   for (; i < 400; i += baseInterval) {
   *     if (!isValidColor(toRGB, { x: i, y: j, z: offset })) {
   *       continue;
   *     }
   *     points.push({ color: toRGB({ x: i, y: j, z: offset }), x: i / baseInterval });
   *   }
   *   rows.push(points);
   *   i = 0;
   * }

   * return rows; */

  const planes = {
    center: 0,
    boundaries: { u: 0, d: 0, l: 0, r: 0, f: 0, b: 0 },
    points: [[{ color: startingColor, position: new Point() }]],
  };

  let boundaries = { u: 0, d: 0, l: 0, r: 0, f: 0, b: 0 };
  let lastBoundaries = { u: -1, d: -1, l: -1, r: -1, f: -1, b: -1 };

  while (!boundariesEqual(boundaries, lastBoundaries)) {
    lastBoundaries = { ...boundaries };
    for (let i = lastBoundaries.d - 1; i <= lastBoundaries.u + 1; i++) {
      for (let j = lastBoundaries.l - 1; j <= lastBoundaries.r + 1; j++) {
        for (
          let k = lastBoundaries.b - 1;
          k <= lastBoundaries.f + 1;
          k =
            i == lastBoundaries.d - 1 ||
            i == lastBoundaries.u + 1 ||
            j == lastBoundaries.l - 1 ||
            j == lastBoundaries.r + 1 ||
            k == lastBoundaries.f + 1
              ? k + 1
              : lastBoundaries.f + 1
        ) {
          // TODO: implement change of orientation
          let pos = planes.points[planes.center][0].color.toPos.sum(
            Point.from({
              x: i * baseInterval,
              y: j * baseInterval,
              z: k * baseInterval,
            }),
          );

          if (Color.fromPos(pos).valid) {
            while (k + planes.center < 0) {
              planes.points.unshift([]);
              planes.center++;
            }
            while (k + planes.center > planes.points.length - 1) {
              planes.points.push([]);
            }
            planes.points[k + planes.center].push({
              color: Color.fromPos(pos),
              position: { x: i, y: j, z: k },
            });
            boundaries.u += i == boundaries.u + 1 ? 1 : 0;
            boundaries.d -= i == boundaries.d - 1 ? 1 : 0;
            boundaries.l -= j == boundaries.l - 1 ? 1 : 0;
            boundaries.r += j == boundaries.r + 1 ? 1 : 0;
            boundaries.f += k == boundaries.f + 1 ? 1 : 0;
            boundaries.b -= k == boundaries.b - 1 ? 1 : 0;
          }
        }
      }
    }
  }

  planes.boundaries = { ...boundaries };

  return planes;
}
