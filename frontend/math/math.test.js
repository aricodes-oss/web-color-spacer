import math from '.';

test('has bidirectional srgb/xyz transforms', () => {
  const input = [128, 128, 128];
  expect(
    math.evaluate('srgb_to_xyz(xyz_to_srgb(input)) == input', { input }).every(Boolean),
  ).toBeTruthy();
});
