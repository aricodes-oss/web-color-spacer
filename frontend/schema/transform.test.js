import Transform from './transform';

const scope = { k: 'v' };

test('accepts arbitrary k/v pairs for scope', () => {
  const parsed = Transform.from({ input: [1, 5, 9], scope });

  expect(parsed.scope.k).toBe(scope.k);
});
