import * as cam16 from '@/utils/cam16';
import { create, all } from 'mathjs';

const math = create(all);

math.import(cam16, { wrap: true });

export default math;
