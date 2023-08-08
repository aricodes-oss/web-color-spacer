import Resource from './base';
import Point from './point';
import Transform from './transform';
import math from '@/math';
import { rgbToHex } from '@/utils';
import { createModelSchema } from 'serializr';

// Manually tweak these
let redmorph = 0.00023;
let bluemorph = 0.00083;
let bluescale = 0.5;
let grayscale = 3;
let redshift = -6;
let blueshift = 3;

let transformY = Transform.from({
  scope: { m: redmorph, s: redshift, p: 'cbrt(sqrt(81*m^4*x^2 + 12*m^3) - 9*m^2*x)' },
  forwardexpr: 'm*(x - s)^3 + x - s',
  inverseexpr: 'cbrt(2/3)/evaluate(p, {x:x, m:m}) - evaluate(p, {x:x,m:m})/(cbrt(18)*m) + s',
});

function inverse_x3x_Cubic(x, scale) {
  const scope = {
    x,
    s: scale,
  };
  math.evaluate('p = cbrt(sqrt(81*s^4*x^2 + 12*s^3) - 9*s^2*x)', scope);
  return math.evaluate('cbrt(2/3)/p - p/(cbrt(18)*s)', scope);
}

class Color extends Resource {
  r = 0;
  g = 0;
  b = 0;

  // Inverse function of toPos()--make sure this is kept up-to-date when toPos() is changed
  static fromPos = ({ x, y, z }) => {
    let [r, g, b] = math.xyz_to_srgb(
      math.cam16_ucs_inverse({
        J: x / grayscale,
        a: transformY.inverse(y),
        b: inverse_x3x_Cubic(z / bluescale, bluemorph) - blueshift,
      }),
    );
    let a = this.from(
      Object.fromEntries(Object.entries({ r, g, b }).map(([k, v]) => [k, v * 255])),
    );

    return this.from({ r: Math.trunc(a.r), g: Math.trunc(a.g), b: Math.trunc(a.b) });
  };

  // Manually tweaked cubic transformation after cam16
  get toPos() {
    let jab = math.cam16_ucs(math.srgb_to_xyz([this.r / 255, this.g / 255, this.b / 255]));
    return Point.from({
      x: grayscale * jab.J,
      y: transformY.forward(jab.a),
      z: math.evaluate('c*(m*(b + s)^3 + b + s)', {
        m: bluemorph,
        b: jab.b,
        s: blueshift,
        c: bluescale,
      }),
    });
  }

  get gray() {
    return this.r === this.g && this.g === this.b;
  }

  get hex() {
    return rgbToHex(this);
  }

  get valid() {
    return [this.r, this.g, this.b].every(component => component >= 0 && component <= 255);
  }

  // TODO: Add PropTypes shape
}

createModelSchema(Color, {
  r: true,
  g: true,
  b: true,
});

export default Color;
