export default function gradientColors(toRGB, offset, baseInterval = 17) {
  const rows = [];

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

  return rows;
}

function isValidColor(toRGB, color) {
  let c = toRGB(color);
  return c.r >= 0 && c.r <= 255 && c.g >= 0 && c.g <= 255 && c.b >= 0 && c.b <= 255;
}
