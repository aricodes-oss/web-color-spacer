export default function gradientColors(fromRGB, toRGB, startingColor, baseInterval = 17) {
  /*const rows = [];

  let i = 0;
  let j = 0;
  // TODO: implement orientation
  for (; j < 400; j += baseInterval) {
    const points = [];
    for (; i < 400; i += baseInterval) {
      if (!isValidColor(toRGB, { x: i, y: j, z: offset })) {
        continue;
      }
      points.push({ color: toRGB({ x: i, y: j, z: offset }), x: i / baseInterval });
    }
    rows.push(points);
    i = 0;
  }

  return rows;*/

  const planes = {
    center: 0,
    boundaries: { u: 0, d: 0, l: 0, r: 0, f: 0, b: 0 },
    points: [[{ color: startingColor, position: { x: 0, y: 0, z: 0 } }]],
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
          let pos = positionsSum(fromRGB(planes.points[planes.center][0].color), {
            x: i * baseInterval,
            y: j * baseInterval,
            z: k * baseInterval,
          });
          if (isValidColor(toRGB, pos)) {
            while (k + planes.center < 0) {
              planes.points.unshift([]);
              planes.center++;
            }
            while (k + planes.center > planes.points.length - 1) {
              planes.points.push([]);
            }
            planes.points[k + planes.center].push({
              color: toRGB(pos),
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

function positionsSum(p1, p2) {
  return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
}

function boundariesEqual(b1, b2) {
  return (
    b1.u == b2.u && b1.d == b2.d && b1.l == b2.l && b1.r == b2.r && b1.f == b2.f && b1.b == b2.b
  );
}

function isValidColor(toRGB, color) {
  let c = toRGB(color);
  return c.r >= 0 && c.r <= 255 && c.g >= 0 && c.g <= 255 && c.b >= 0 && c.b <= 255;
}
