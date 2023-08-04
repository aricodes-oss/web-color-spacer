import {
  createModelSchema,
  getDefaultModelSchema,
  object,
  primitive,
  deserialize,
} from 'serializr';
import { math } from '@/math';

// note: this is designed to handle 1d nonlinear transformations.
// the idea is to handle higher dimensional ones by sandwiching these between matrix multiplication.
class Transform {
  scope = {};
  forwardexpr = ''; // might need to sanitize this later
  inverseexpr = '';

  forward(x) {
    let s = { x, ...this.scope };
    math.evaluate(this.forwardexpr, s);
  }

  inverse(x) {
    let s = { x, ...this.scope };
    math.evaluate(this.inverseexpr, s);
  }

  static from(obj) {
    tf = deserialize(obj);

    const testinput = [35, 149, 243]; // arbitrary inputs to test against
    for (const i in testinput) {
      // i don't know if this condition works
      if (math.evaluate('tf.inverse(tf.forward(i)) != input', { i, tf: this })) {
        // fail visibly but hopefully not catastrophically
        tf.forwardfunc = '0';
        tf.inversefunc = '0';
      }
    }
    return tf;
  }
}

// was trying to use serializr but i don't know how to serialize an arbitrary object
createModelSchema(Transform, {
  scope: object(Object),
  input: primitive(),
  forwardfunc: primitive(),
  inversefunc: primitive(),
});
