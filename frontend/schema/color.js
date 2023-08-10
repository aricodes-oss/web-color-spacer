import Resource from './base';
import Point from './point';
import Transform from './transform';
import math from '@/math';
import { rgbToHex } from '@/utils';
import { createModelSchema } from 'serializr';
import Transform3d from './transform3d';

// Manually tweak these
let redmorph = 0.00023;
let bluemorph = 0.00083;
let bluescale = 0.5;
let grayscale = 3;
let redshift = -6;
let blueshift = 3;

// inverse expr ternary operator to specify limiting behavior for m=0
// otherwise it'd attempt to evaluate 0/0
let transform = Transform3d.from({
  scopeX: { c: grayscale, m: 0, s: 0 },
  scopeY: { c: 1, m: redmorph, s: redshift },
  scopeZ: { c: bluescale, m: bluemorph, s: -blueshift },
  forwardexprs: ['c*(m*(x - s)^3 + x - s)'],
  inverseexprs: [
    'p = cbrt(sqrt(81*m^4*(x/c)^2 + 12*m^3) - 9*m^2*(x/c))',
    '(p != 0) ? cbrt(2/3)/p - p/(cbrt(18)*m) + s : x/c + s',
  ],
});

class Color extends Resource {
  r = 0;
  g = 0;
  b = 0;

  // Inverse function of toPos()--make sure this is kept up-to-date when toPos() is changed
  static fromPos = ({ x, y, z }) => {
    let [r, g, b] = math.xyz_to_srgb(
      math.cam16_ucs_inverse({
        J: transform.tfX.inverse(x),
        a: transform.tfY.inverse(y),
        b: transform.tfZ.inverse(z),
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
      x: transform.tfX.forward(jab.J),
      y: transform.tfY.forward(jab.a),
      z: transform.tfZ.forward(jab.b),
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
