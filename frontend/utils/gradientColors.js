export default function gradientColors(coefficients, offset, baseInterval = 17) {
  const [xAxis, yAxis] = Object.keys(coefficients);
  const point = { r: offset, g: offset, b: offset };

  const rows = [];

  for (let i = 0; i < 255; i += baseInterval / Math.sqrt(coefficients[xAxis])) {
    const points = [];
    for (let j = 0; j < 255; j += baseInterval / Math.sqrt(coefficients[yAxis])) {
      points.push({ ...point, [xAxis]: Math.trunc(i), [yAxis]: Math.trunc(j) });
    }
    rows.push(points);
  }

  return rows;
}
