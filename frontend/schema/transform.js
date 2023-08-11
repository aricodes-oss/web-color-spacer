import Resource from './base';
import math from '@/math';
import { createModelSchema, map, list, primitive } from 'serializr';

// note: this is designed to handle 1d nonlinear transformations.
// the idea is to handle higher dimensional ones by sandwiching these between matrix multiplication.
class Transform extends Resource {
  scope = {};
  // might need to sanitize these strings later
  expressions = { forward: [''], inverse: [''] };

  forward = x => {
    let s = { x, ...this.scope };
    // remind me later if this eventually somehow neglects to return an array
    return math.evaluate(this.expressions.forward, s).pop();
  };

  inverse = x => {
    let s = { x, ...this.scope };
    this.checkinvertible(x);
    return math.evaluate(this.expressions.inverse, s).pop();
  };

  checkinvertible = x => {
    // essentially if (this.inverse(this.forward(x)) == x)
    // uses mathjs for builtin floating point error bounds
    // avoids this.inverse() to prevent infinite recursion when called from inverse()
    if (
      !math.equal(
        math.evaluate(this.expressions.inverse, { x: this.forward(x), ...this.scope }).pop(),
        x,
      )
    ) {
      console.log(x);
      console.log(
        math.evaluate(this.expressions.inverse, { x: this.forward(x), ...this.scope }).pop(),
      );
      throw new Error(
        'Inverse is not the inverse of forward, or floating point errors exceeded epsilon',
      );
    }
  };
}

createModelSchema(Transform, {
  scope: map(),
  expressions: map(list(primitive())),
});

export default Transform;
