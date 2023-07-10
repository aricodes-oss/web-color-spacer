import Color from './color';
import { createModelSchema, primitive, object, identifier } from 'serializr';

class Measurement {
  id = 0;
  start = new Color();
  end = new Color();

  distance = 0;

  get gray() {
    return this.start.gray && this.end.gray;
  }
}

createModelSchema(Measurement, {
  id: identifier(),
  start: object(Color),
  end: object(Color),
  distance: primitive(),
});

export default Measurement;
