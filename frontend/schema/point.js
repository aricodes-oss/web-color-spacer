import { createModelSchema, primitive, deserialize } from 'serializr';

class Point {
  x = 0;
  y = 0;
  z = 0;

  static from = obj => deserialize(Point, obj);
  sum = rhs => Object.keys(rhs).reduce((acc, key) => ({ ...acc, [key]: this[key] + rhs[key] }), {});
}

createModelSchema(Point, {
  x: primitive(),
  y: primitive(),
  z: primitive(),
});

export default Point;
