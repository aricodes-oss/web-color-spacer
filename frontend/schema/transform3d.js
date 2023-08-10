import Resource from './base';
import Transform from './transform';
import { map, list, primitive, createModelSchema, deserialize } from 'serializr';

class Transform3d extends Resource {
  tfX = new Transform();
  tfY = new Transform();
  tfZ = new Transform();

  scopeX = {};
  scopeY = {};
  scopeZ = {};
  forwardexprs = [''];
  inverseexprs = [''];

  // override
  static from(obj) {
    let t = deserialize(this, obj);
    t.tfX = Transform.from({
      scope: t.scopeX,
      forwardexprs: t.forwardexprs,
      inverseexprs: t.inverseexprs,
    });
    t.tfY = Transform.from({
      scope: t.scopeY,
      forwardexprs: t.forwardexprs,
      inverseexprs: t.inverseexprs,
    });
    t.tfZ = Transform.from({
      scope: t.scopeZ,
      forwardexprs: t.forwardexprs,
      inverseexprs: t.inverseexprs,
    });
    return t;
  }
}

createModelSchema(Transform3d, {
  scopeX: map(),
  scopeY: map(),
  scopeZ: map(),
  forwardexprs: list(primitive()),
  inverseexprs: list(primitive()),
});

export default Transform3d;
