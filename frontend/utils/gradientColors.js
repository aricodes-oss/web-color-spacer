export default function gradientColors(fromRGB, toRGB, offset, baseInterval = 17) {
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

  const points = [
    { color: { r: 128, g: 128, b: 128 }, position: fromRGB({ r: 128, g: 128, b: 128 }) },
  ];

  let boundaries = { u: 0, d: 0, l: 0, r: 0, f: 0, b: 0 };
  let lastBoundaries = { u: 0, d: 0, l: 0, r: 0, f: 0, b: 0 };

  function keyPosHelper(faceKey, i, j) {
    switch (faceKey) {
      case u:
        return { x: i, y: j, z: lastBoundaries.u + baseInterval };
      case d:
        return { x: i, y: j, z: -lastBoundaries.d - baseInterval };
      case l:
        return { x: -lastBoundaries.l - baseInterval, y: i, z: j };
      case r:
        return { x: lastBoundaries.r + baseInterval, y: i, z: j };
      case f:
        return { x: i, y: lastBoundaries.f + baseInterval, z: j };
      case b:
        return { x: i, y: -lastBoundaries.f - baseInterval, z: j };
      default:
      // idk
    }
  }

  function faceExpand(faceKey, lowBound1, highBound1, lowBound2, highBound2) {
    for (let i = lowBound1; i <= highBound1; i += baseInterval) {
      for (let j = lowBound2; j <= highBound2; j += baseInterval) {
        testPos = positionsSum(points[0].position, keyPosHelper(faceKey, i, j));
        if (isValidColor(toRGB, testPos)) {
          boundaries[faceKey] = lastBoundaries[faceKey] + baseInterval;
          points.push({ color: toRGB(testPos), position: {} });
        }
      }
    }
  }

  while (!boundariesEqual(boundaries, lastBoundaries)) {
    lastBoundaries = { ...boundaries };
    faceExpand(
      'u',
      -lastBoundaries.l - baseInterval,
      lastBoundaries.r + baseInterval,
      -lastBoundaries.b - baseInterval,
      lastBoundaries.f + baseInterval,
    );
    faceExpand(
      'd',
      -lastBoundaries.l - baseInterval,
      lastBoundaries.r + baseInterval,
      -lastBoundaries.b - baseInterval,
      lastBoundaries.f + baseInterval,
    );
    // the rest of these will double-count edge and corner points for the list, but they should render fine
    faceExpand(
      'l',
      -lastBoundaries.b - baseInterval,
      lastBoundaries.f + baseInterval,
      -lastBoundaries.d - baseInterval,
      lastBoundaries.u + baseInterval,
    );
    faceExpand(
      'r',
      -lastBoundaries.b - baseInterval,
      lastBoundaries.f + baseInterval,
      -lastBoundaries.d - baseInterval,
      lastBoundaries.u + baseInterval,
    );
    faceExpand(
      'f',
      -lastBoundaries.l - baseInterval,
      lastBoundaries.r - baseInterval,
      -lastBoundaries.d - baseInterval,
      lastBoundaries.u + baseInterval,
    );
    faceExpand(
      'b',
      -lastBoundaries.l - baseInterval,
      lastBoundaries.r - baseInterval,
      -lastBoundaries.d - baseInterval,
      lastBoundaries.u + baseInterval,
    );
  }
}

function positionsSum(p1, p2) {
  return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
}

function positionsEqual(p1, p2) {
  return p1.x == p2.x && p1.y == p2.y && p1.z == p2.z;
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
