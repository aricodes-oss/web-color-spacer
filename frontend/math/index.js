import * as cam16 from '@/utils/cam16';
import { create, all } from 'mathjs';

const config = {
  predictable: true, // this should prevent complex numbers from popping up where they don't belong
};

const math = create(all, config);

math.import(cam16, { wrap: true });

export default math;
