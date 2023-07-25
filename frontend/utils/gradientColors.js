// The entrypoint of the schema package depends on this file, so we import the
// members we need directly from their source file to avoid an import loop
import Boundary from '@/schema/boundary';
import Color from '@/schema/color';
import Point from '@/schema/point';

const boundariesEqual = (lhs, rhs) => Object.keys(lhs).every(key => lhs[key] === rhs[key]);

export default function gradientColors(startingColor, baseInterval = 17) {
  const planes = {
    center: 0,
    boundaries: new Boundary(),
    points: [[{ color: startingColor, position: new Point() }]],
  };

  let boundaries = new Boundary();
  // set specifically to be non-equal to `boundaries`
  let lastBoundaries = Boundary.from({ x: { upper: -1 } });

  while (!boundariesEqual(boundaries, lastBoundaries)) {
    lastBoundaries = { ...boundaries };

    for (
      let xPosIdx = lastBoundaries.x.lower - 1;
      xPosIdx <= lastBoundaries.x.upper + 1;
      xPosIdx++
    ) {
      for (
        let yPosIdx = lastBoundaries.y.lower - 1;
        yPosIdx <= lastBoundaries.y.upper + 1;
        yPosIdx++
      ) {
        // when you're not on the x or y facing faces of the search space, only sample the nearest and farthest points on z (hollow out the cube)
        for (
          let zPosIdx = lastBoundaries.z.lower - 1;
          zPosIdx <= lastBoundaries.z.upper + 1;
          zPosIdx =
            xPosIdx == lastBoundaries.x.lower - 1 ||
            xPosIdx == lastBoundaries.x.upper + 1 ||
            yPosIdx == lastBoundaries.y.lower - 1 ||
            yPosIdx == lastBoundaries.y.upper + 1 ||
            zPosIdx == lastBoundaries.z.upper + 1
              ? zPosIdx + 1
              : lastBoundaries.z.upper + 1
        ) {
          // TODO: implement change of orientation
          let pos = planes.points[planes.center][0].color.toPos.sum(
            Point.from({
              x: xPosIdx * baseInterval,
              y: yPosIdx * baseInterval,
              z: zPosIdx * baseInterval,
            }),
          );

          let idx = zPosIdx + planes.center;

          if (Color.fromPos(pos).valid) {
            // pad the array with empty planes before attempting to index oob, and keep track of which index was originally index 0.
            // these loops should only ever run 0 or 1 times each time they're reached.
            // just in case they don't, i used while instead of if to maintain a functional state instead of indexing oob
            // i should probably have something in place to tell me if they ever run twice.
            while (idx < 0) {
              planes.points.unshift([]);
              planes.center++;
              idx++;
            }
            while (idx > planes.points.length - 1) {
              planes.points.push([]);
            }

            // push the current color to the current plane
            planes.points[idx].push({
              color: Color.fromPos(pos),
              position: Point.from({ x: xPosIdx, y: yPosIdx, z: zPosIdx }),
            });

            // expand out the search space for the next iteration whenever the first valid color is found in a given direction
            // this could probably be iterated through for brevity
            boundaries.x.upper += xPosIdx == boundaries.x.upper + 1 ? 1 : 0;
            boundaries.y.upper += yPosIdx == boundaries.y.upper + 1 ? 1 : 0;
            boundaries.z.upper += zPosIdx == boundaries.z.upper + 1 ? 1 : 0;

            boundaries.x.lower -= xPosIdx == boundaries.x.lower - 1 ? 1 : 0;
            boundaries.y.lower -= yPosIdx == boundaries.y.lower - 1 ? 1 : 0;
            boundaries.z.lower -= zPosIdx == boundaries.z.lower - 1 ? 1 : 0;
          }
        }
      }
    }
  }

  planes.boundaries = { ...boundaries };

  return planes;
}
