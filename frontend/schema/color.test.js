import Color from './color';
import { deserialize } from 'serializr';

const rand = cap => Math.floor(Math.random() * cap);
const colorFrom = obj => deserialize(Color, obj);

test('detects grays', () => {
  const val = rand(255);

  expect(
    colorFrom({
      r: val,
      g: val,
      b: val,
    }).gray,
  ).toBeTruthy();

  expect(
    colorFrom({
      r: rand(255),
      g: rand(255),
      b: rand(255),
    }).gray,
  ).toBeFalsy();
});
