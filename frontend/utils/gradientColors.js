// The entrypoint of the schema package depends on this file, so we import the
// members we need directly from their source file to avoid an import loop
import Boundary from '@/schema/boundary';
import Color from '@/schema/color';
import Point from '@/schema/point';
import { serialize } from 'serializr';

const boundariesEqual = (lhs, rhs) => Object.keys(lhs).every(key => lhs[key] === rhs[key]);

export default function gradientColors(startingColor, baseInterval = 17) {
  const planes = {
    center: 0,
    boundaries: new Boundary(),
    points: [[{ color: startingColor, position: new Point() }]],
  };

  let boundary = new Boundary();
  // set specifically to be non-equal to `boundaries`
  let last = Boundary.from({ x: { upper: -1 } });
  let position = Point.from({ x: last.x.under, y: last.y.under, z: last.z.under });

  while (!boundary.eq(last)) {
    last = Boundary.from(serialize(boundary));

    for (position.x = last.x.under; position.x <= last.x.over; position.x += 1) {
      for (position.y = last.y.under; position.y <= last.y.over; position.y += 1) {
        // when you're not on the x or y facing faces of the search space, only sample the nearest and farthest points on z (hollow out the cube)

        for (
          position.z = last.z.under;
          position.z <= last.z.over;
          position.z =
            last.x.adjacent(position.x) || last.y.adjacent(position.y) || last.z.isOver(position.z)
              ? position.z + 1
              : last.z.over
        ) {
          // TODO: implement change of orientation
          let pos = planes.points[planes.center][0].color.toPos.sum(
            Point.from({
              x: position.x * baseInterval,
              y: position.y * baseInterval,
              z: position.z * baseInterval,
            }),
          );

          let idx = position.z + planes.center;

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
              position: Point.from(position),
            });

            // expand out the search space for the next iteration whenever the first valid color is found in a given direction
            // this could probably be iterated through for brevity
            boundary.expandTowards(position);
          }
        }
      }
    }
  }

  planes.boundaries = { ...boundary };

  return planes;
}
