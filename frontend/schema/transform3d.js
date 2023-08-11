import Resource from './base';
import Transform from './transform';
import { map, list, primitive, object, createModelSchema, deserialize } from 'serializr';

class Transform3d extends Resource {
  transforms = { x: new Transform(), y: new Transform(), z: new Transform() };
  scopes = { x: {}, y: {}, z: {} };
  expressions = { forward: [''], inverse: [''] };

  // override
  static from(obj) {
    let t = deserialize(this, obj);
    ['x', 'y', 'z'].map(key => {
      t.transforms[key] = Transform.from({
        scope: t.scopes[key],
        expressions: t.expressions,
      });
    });
    return t;
  }
}

createModelSchema(Transform3d, {
  scopes: map(map()), // note: provides no confirmation that the keys are correct
  expressions: map(list(primitive())),
});

export default Transform3d;
