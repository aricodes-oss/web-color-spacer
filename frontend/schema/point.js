import Resource from './base';
import { createModelSchema, primitive, serialize } from 'serializr';

class Point extends Resource {
  x = 0;
  y = 0;
  z = 0;

  sum = rhs => Object.keys(rhs).reduce((acc, key) => ({ ...acc, [key]: this[key] + rhs[key] }), {});
  eq = rhs => this.axes.every((val, idx) => rhs.axes[idx] === val);

  get keys() {
    return Object.keys(serialize(this));
  }

  get axes() {
    return [this.x, this.y, this.z];
  }
}

createModelSchema(Point, {
  x: primitive(),
  y: primitive(),
  z: primitive(),
});

export default Point;
