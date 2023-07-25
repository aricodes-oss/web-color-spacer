import { createModelSchema, object, primitive, deserialize } from 'serializr';

export class Bounds {
  upper = 0;
  lower = 0;

  static from = obj => deserialize(Bounds, obj);
}

class Boundary {
  x = new Bounds();
  y = new Bounds();
  z = new Bounds();

  static from = obj => deserialize(Boundary, obj);
}

createModelSchema(Bounds, {
  upper: primitive(),
  lower: primitive(),
});

createModelSchema(Boundary, {
  x: object(Bounds),
  y: object(Bounds),
  z: object(Bounds),
});

export default Boundary;
