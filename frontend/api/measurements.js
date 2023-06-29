import APIResource from './base';
import { createModelSchema, primitive, object, identifier } from 'serializr';

class Color {
  r = 0;
  g = 0;
  b = 0;

  get gray() {
    return this.r === this.g && this.g === this.b;
  }
}

class Measurement {
  id = 0;
  from = new Color();
  to = new Color();

  distance = 0;
}

createModelSchema(Color, {
  r: primitive(),
  g: primitive(),
  b: primitive(),
});

createModelSchema(Measurement, {
  id: identifier(),
  start: object(Color),
  end: object(Color),
  distance: primitive(),
});

class MeasurementsResource extends APIResource {
  resource = 'measurements';
  model = Measurement;
}

const measurements = new MeasurementsResource();

export default measurements;
