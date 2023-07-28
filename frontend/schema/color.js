import Point from './point';
import { rgbToHex } from '@/utils';
import { cam16_ucs, srgb_to_xyz, xyz_to_srgb, cam16_ucs_inverse } from '@/utils/cam16';
import { createModelSchema, primitive, deserialize } from 'serializr';

let redmorph = 0.00023;
let bluemorph = 0.00083;
let bluescale = 0.5;
let grayscale = 5;
let redshift = -6;
let blueshift = 3;

function inverse_x3x_Cubic(x, scale) {
  return (
    Math.pow(
      2 /
        (Math.sqrt(729 * Math.pow(scale, 4) * Math.pow(x, 2) + 108 * Math.pow(scale, 3)) -
          27 * Math.pow(scale, 2) * x),
      1 / 3,
    ) -
    Math.pow(
      (Math.sqrt(81 * Math.pow(x / scale, 2) + 12 / Math.pow(scale, 3)) - (9 / scale) * x) / 18,
      1 / 3,
    )
  );
}

class Color {
  r = 0;
  g = 0;
  b = 0;

  static from = obj => deserialize(Color, obj);

  // Inverse function of toPos()--make sure this is kept up-to-date when toPos() is changed
  static fromPos = ({ x, y, z }) => {
    /* let a = this.from({
      r: (4 / 3) * (x - 0.5 * y),
      g: (4 / 3) * (y - 0.5 * x),
      b: z - (4 / 15) * (0.5 * x + 0.5 * y),
    }); */
    let fromJab = xyz_to_srgb(
      cam16_ucs_inverse({
        J: x / grayscale,
        a: inverse_x3x_Cubic(y, redmorph) + redshift,
        b: inverse_x3x_Cubic(z / bluescale, bluemorph) - blueshift,
      }),
    );
    let a = this.from({
      r: fromJab[0] * 255,
      g: fromJab[1] * 255,
      b: fromJab[2] * 255,
    });
    // TODO: move this check to a proper unit test so it stops lagging me out on file save if something's wrong
    if (
      a.valid &&
      !a.toPos.axes.every(
        (axis, idx) => axis <= [x, y, z][idx] + 0.00000001 && axis >= [x, y, z][idx] - 0.00000001,
      )
    ) {
      console.log("something's wrong with fromPos");
      console.log({ x, y, z });
      console.log(a.toPos);
    }
    return this.from({ r: Math.trunc(a.r), g: Math.trunc(a.g), b: Math.trunc(a.b) });
  };

  // Arbitrary placeholder transformation
  get toPos() {
    /* return Point.from({
      x: this.r + 0.5 * this.g,
      y: this.g + 0.5 * this.r,
      z: this.b + 0.2 * this.g + 0.2 * this.r,
    }); */
    let jab = cam16_ucs(srgb_to_xyz([this.r / 255, this.g / 255, this.b / 255]));
    return Point.from({
      x: grayscale * jab.J,
      y: redmorph * Math.pow(jab.a - redshift, 3) + jab.a - redshift,
      z: bluescale * (bluemorph * Math.pow(jab.b + blueshift, 3) + (jab.b + blueshift)),
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
  r: primitive(),
  g: primitive(),
  b: primitive(),
});

export default Color;
