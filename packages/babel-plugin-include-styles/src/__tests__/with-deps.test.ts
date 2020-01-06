import { transform } from './helpers/utils';
import exists from '../exists';

jest.mock('../exists.ts');
jest.mock('@cgds/last/package.json', () => ({}), { virtual: true });
jest.mock(
  '@cgds/other/package.json',
  () => ({ dependencies: { '@cgds/last': '1.0.0' } }),
  { virtual: true }
);
jest.mock(
  '@cgds/test/package.json',
  () => ({ dependencies: { '@cgds/other': '1.0.0' } }),
  { virtual: true }
);

test("should add dependency's css", () => {
  // @ts-ignore
  exists.mockReturnValueOnce(true);
  // @cgds/other doesn't have css itself, but import components that do have css
  // @ts-ignore
  exists.mockReturnValueOnce(false);
  // @ts-ignore
  exists.mockReturnValueOnce(true);

  const source = 'import Test from "@cgds/test";';
  expect(transform(source)).toBe(
    'import Test from "@cgds/test";\nimport "@cgds/last/dist/main.css";\nimport "@cgds/test/dist/main.css";'
  );
});
