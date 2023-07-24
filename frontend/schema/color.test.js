import Color from './color';

const rand = cap => Math.floor(Math.random() * cap);

test('detects grays', () => {
  const val = rand(255);

  expect(
    Color.from({
      r: val,
      g: val,
      b: val,
    }).gray,
  ).toBeTruthy();

  expect(
    Color.from({
      r: rand(255),
      g: rand(255),
      b: rand(255),
    }).gray,
  ).toBeFalsy();
});

test('detects invalid colors', () => {
  const under = -1;
  const over = 256;

  const data = { r: rand(255), g: rand(255), b: rand(255) };

  expect(Color.from(data).valid).toBeTruthy();
  expect(Color.from({ ...data, g: over }).valid).toBeFalsy();
  expect(Color.from({ ...data, b: under }).valid).toBeFalsy();
});
