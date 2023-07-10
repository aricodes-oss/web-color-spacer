export function gradientColors(coeff1, c1Color, coeff2, c2Color, offset) {
  var gradientRows = [];
  for (let i = 0; i < 255; i += 17 / Math.sqrt(coeff1)) {
    var gradientPoints = [];
    for (let j = 0; j < 255; j += 17 / Math.sqrt(coeff2)) {
      var point = { r: offset, g: offset, b: offset };
      const pointKeys = Object.keys(point);

      if (!pointKeys.includes(c1Color) || !pointKeys.includes(c2Color)) {
        console.log(`c1:${c1Color} c2:${c2Color}`);
      }

      point[c1Color.toLowerCase()] = Math.trunc(i);
      point[c2Color.toLowerCase()] = Math.trunc(j);

      gradientPoints.push(point);
    }
    gradientRows.push(gradientPoints);
  }
  return gradientRows;
}
