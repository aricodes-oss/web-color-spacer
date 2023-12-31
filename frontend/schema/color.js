import { rgbToHex } from '@/utils';
import { createModelSchema, primitive } from 'serializr';

class Color {
  r = 0;
  g = 0;
  b = 0;

  get gray() {
    return this.r === this.g && this.g === this.b;
  }

  get hex() {
    return rgbToHex(this);
  }
}

createModelSchema(Color, {
  r: primitive(),
  g: primitive(),
  b: primitive(),
});

export default Color;
