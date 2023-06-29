import Color from './color';
import { createModelSchema, primitive, object, identifier } from 'serializr';

class Measurement {
  id = 0;
  from = new Color();
  to = new Color();

  distance = 0;
}

createModelSchema(Measurement, {
  id: identifier(),
  start: object(Color),
  end: object(Color),
  distance: primitive(),
});

export default Measurement;
