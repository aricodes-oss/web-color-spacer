import Point from './point';
import { rgbToHex } from '@/utils';
import { createModelSchema, primitive, deserialize } from 'serializr';

class Color {
  r = 0;
  g = 0;
  b = 0;

  static from = obj => deserialize(Color, obj);

  // Inverse function of toPos()--make sure this is kept up-to-date when toPos() is changed
  static fromPos = ({ x, y, z }) => {
    let a = this.from({
      r: (4 / 3) * (x - 0.5 * y),
      g: (4 / 3) * (y - 0.5 * x),
      b: z - (4 / 15) * (0.5 * x + 0.5 * y),
    });
    // TODO: move this check to a proper unit test so it stops lagging me out on file save if something's wrong
    if (
      !a.toPos.axes.every(
        (axis, idx) => axis <= [x, y, z][idx] + 0.000000001 && axis >= [x, y, z][idx] - 0.000000001,
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
    return Point.from({
      x: this.r + 0.5 * this.g,
      y: this.g + 0.5 * this.r,
      z: this.b + 0.2 * this.g + 0.2 * this.r,
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
