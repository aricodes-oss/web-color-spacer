export function gradientColors(coeff1, c1Color, coeff2, c2Color, offset) {
  var gradientRows = [];
  for (let i = 0; i < 255; i += 17 / Math.sqrt(coeff1)) {
    var gradientPoints = [];
    for (let j = 0; j < 255; j += 17 / Math.sqrt(coeff2)) {
      var point = { r: offset, g: offset, b: offset };
      switch (c1Color) {
        case 'R':
          point.r = Math.trunc(i);
          break;
        case 'G':
          point.g = Math.trunc(i);
          break;
        case 'B':
          point.b = Math.trunc(i);
          break;
        default:
          console.log('c1Color not R, G, or B');
      }
      switch (c2Color) {
        case 'R':
          point.r = Math.trunc(j);
          break;
        case 'G':
          point.g = Math.trunc(j);
          break;
        case 'B':
          point.b = Math.trunc(j);
          break;
        default:
          console.log('c2Color not R, G, or B');
      }
      gradientPoints.push(point);
    }
    gradientRows.push(gradientPoints);
  }
  return gradientRows;
}
