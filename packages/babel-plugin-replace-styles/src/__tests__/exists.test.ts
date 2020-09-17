import exists from '../exists';

test('should detect module exists', () => {
  expect(exists('./index.ts')).toBe(true);
});

test('should detect module does not exists', () => {
  expect(exists('./foo.ts')).toBe(false);
});
