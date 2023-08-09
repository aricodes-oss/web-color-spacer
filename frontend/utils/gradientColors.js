// The entrypoint of the schema package depends on this file, so we import the
// members we need directly from their source file to avoid an import loop
import Boundary from '@/schema/boundary';
import Color from '@/schema/color';
import Point from '@/schema/point';
import { serialize } from 'serializr';

export default function gradientColors(startingColor, baseInterval = 17) {
  const heartwood = {};

  // not a 3d array because negative indices are really convenient here
  // in retrospect this probably did more harm than good though
  let sapwood = {
    0: { 0: { 0: startingColor } },
  };

  const bark = {};

  let temp = {};

  const ITERATION_CUTOFF = 100000;
  for (let i = 0; i < ITERATION_CUTOFF && Object.keys(sapwood).length != 0; i++) {
    // loop through points on the boundary
    for (const x in sapwood) {
      for (const y in sapwood[x]) {
        for (const z in sapwood[x][y]) {
          // loop through the cube adjacent to the point
          for (let a = x - 1; a <= x + 1; a++) {
            for (let b = y - 1; b <= y + 1; b++) {
              for (let c = z - 1; c <= z + 1; c++) {
                // do nothing if we've looked at this place before
                // kinda shitty condition but it works i think
                if (
                  (heartwood[a] !== undefined &&
                    heartwood[a][b] !== undefined &&
                    heartwood[a][b][c] !== undefined) ||
                  (sapwood[a] !== undefined &&
                    sapwood[a][b] !== undefined &&
                    sapwood[a][b][c] !== undefined) ||
                  (bark[a] !== undefined && bark[a][b] !== undefined && bark[a][b][c] !== undefined)
                ) {
                  continue;
                }

                // add to bark if the color is invalid
                let pos = startingColor.toPos.sum(
                  Point.from({
                    x: a * baseInterval,
                    y: b * baseInterval,
                    z: c * baseInterval,
                  }),
                );
                if (!Color.fromPos(pos).valid) {
                  setHelper(bark, a, b);
                  bark[a][b][c] = 'invalid';
                  continue;
                }

                // prepare next cycle's sapwood if new and valid
                setHelper(temp, a, b);
                temp[a][b][c] = Color.fromPos(pos);
              }
            }
          }
        }
      }
    }

    // now that the entire for/in is done, add sapwood to heartwood and replace for next cycle
    concatHelper(heartwood, sapwood);
    sapwood = {};
    concatHelper(sapwood, temp);
    temp = {};
  }

  return heartwood;
}

function concatHelper(obj1, obj2) {
  for (const x in obj2) {
    for (const y in obj2[x]) {
      for (const z in obj2[x][y]) {
        setHelper(obj1, x, y);
        obj1[x][y][z] = obj2[x][y][z];
      }
    }
  }
}

function setHelper(obj, a, b) {
  if (obj[a] === undefined) {
    obj[a] = {};
  }
  if (obj[a][b] === undefined) {
    obj[a][b] = {};
  }
}
