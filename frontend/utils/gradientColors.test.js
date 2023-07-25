import gradientColors from './gradientColors';
import Color from '@/schema/color';

const start = Color.from({ r: 128, g: 128, b: 128 });

test('eventually returns', () => {
  const result = gradientColors(start);
  expect(result).toBeTruthy();
});
