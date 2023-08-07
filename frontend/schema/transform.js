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
    math.evaluate(this.forwardexpr, s);
  };

  inverse = x => {
    let s = { x, ...this.scope };
    math.evaluate(this.inverseexpr, s);
  };
}

createModelSchema(Transform, {
  scope: map(), // empty PropSchema matches map[string]any
  input: list(),
  forwardfunc: true, // shorthand for primitive()
  inversefunc: true,
});

export default Transform;
