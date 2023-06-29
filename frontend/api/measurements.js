import APIResource from './base';
import { Measurement } from '@/schema';

class MeasurementsResource extends APIResource {
  resource = 'measurements';
  model = Measurement;
}

const measurements = new MeasurementsResource();

export default measurements;
