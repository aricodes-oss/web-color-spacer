import Transform from './transform';
import { faker } from '@faker-js/faker';

const key = faker.string.alpha();
const scope = { [key]: faker.lorem.word() };

test('accepts arbitrary k/v pairs for scope', () => {
  const parsed = Transform.from({ input: [1, 5, 9], scope });

  expect(parsed.scope[key]).toBe(scope[key]);
});
