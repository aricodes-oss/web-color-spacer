import Resource from './base';
import math from '@/math';
import { createModelSchema, map, list } from 'serializr';

// note: this is designed to handle 1d nonlinear transformations.
// the idea is to handle higher dimensional ones by sandwiching these between matrix multiplication.
class Transform extends Resource {
  scope = {};
  forwardexpr = ''; // might need to sanitize this later
  inverseexpr = '';

  forward = x => {
    let s = { x, ...this.scope };
    return math.evaluate(this.forwardexpr, s);
  };

  inverse = x => {
    let s = { x, ...this.scope };
    if (!math.equal(math.evaluate(this.inverseexpr, { x: this.forward(x), ...this.scope }), x)) {
      throw new Error(
        'Inverse is not the inverse of forward, or floating point errors exceeded epsilon',
      );
    }
    return math.evaluate(this.inverseexpr, s);
  };
}

createModelSchema(Transform, {
  scope: map(), // empty PropSchema matches map[string]any
  forwardexpr: true, // shorthand for primitive()
  inverseexpr: true,
});

export default Transform;
