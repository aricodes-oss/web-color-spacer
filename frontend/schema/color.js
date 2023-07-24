import Point from './point';
import { rgbToHex } from '@/utils';
import { createModelSchema, primitive, deserialize } from 'serializr';

class Color {
  r = 0;
  g = 0;
  b = 0;

  static from = obj => deserialize(Color, obj);

  // TODO: Make these not magic numbers/explain them
  static fromPos = ({ x, y, z }) =>
    this.from({
      r: Math.trunc((4 / 3) * (x - 0.5 * y)),
      g: Math.trunc((4 / 3) * (y - 0.5 * x)),
      b: Math.trunc(z - (4 / 15) * (0.5 * x + 0.5 * y)),
    });

  // TODO: Make these not magic numbers/explain them
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
}

createModelSchema(Color, {
  r: primitive(),
  g: primitive(),
  b: primitive(),
});

export default Color;
