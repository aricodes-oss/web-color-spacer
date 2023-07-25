import { createModelSchema, primitive, deserialize } from 'serializr';

class Point {
  x = 0;
  y = 0;
  z = 0;

  sum = rhs => Object.keys(rhs).reduce((acc, key) => ({ ...acc, [key]: this[key] + rhs[key] }), {});

  get axes() {
    return [this.x, this.y, this.y];
  }

  static from = obj => deserialize(Point, obj);
}

createModelSchema(Point, {
  x: primitive(),
  y: primitive(),
  z: primitive(),
});

export default Point;
