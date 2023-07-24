import { createModelSchema, primitive, deserialize } from 'serializr';

class Boundary {
  xUpper = 0;
  xLower = 0;
  yUpper = 0;
  yLower = 0;
  zUpper = 0;
  zLower = 0;

  static from = obj => deserialize(Boundary, obj);
}

createModelSchema(Boundary, {
  xUpper: primitive(),
  xLower: primitive(),
  yUpper: primitive(),
  yLower: primitive(),
  zUpper: primitive(),
  zLower: primitive(),
});

export default Boundary;
