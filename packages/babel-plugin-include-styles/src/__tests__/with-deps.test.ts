import { transform } from './helpers/utils';
import exists from '../exists';
import resolvePackage from '../resolve-package';

jest.mock('../exists.ts');
jest.mock('../resolve-package.ts');

jest.mock('@cgds/last/package.json', () => ({ name: '@cgds/last' }), {
  virtual: true
});

jest.mock(
  '@cgds/other/package.json',
  () => ({ name: '@cgds/other', dependencies: { '@cgds/last': '1.0.0' } }),
  { virtual: true }
);

jest.mock(
  '@cgds/test/package.json',
  () => ({ name: '@cgds/test', dependencies: { '@cgds/other': '1.0.0' } }),
  { virtual: true }
);

const resolveSpy = resolvePackage as jest.Mock;

test("should add dependency's css", () => {
  // @ts-ignore
  exists.mockReturnValueOnce(true);
  resolveSpy.mockReturnValueOnce('@cgds/test/package.json');
  // @cgds/other doesn't have css itself, but import components that do have css
  // @ts-ignore
  exists.mockReturnValueOnce(false);
  resolveSpy.mockReturnValueOnce('@cgds/other/package.json');
  // @ts-ignore
  exists.mockReturnValueOnce(true);
  resolveSpy.mockReturnValueOnce('@cgds/last/package.json');

  const source = 'import Test from "@cgds/test";';
  expect(transform(source)).toBe(
    'import Test from "@cgds/test";\nimport "@cgds/last/dist/main.css";\nimport "@cgds/test/dist/main.css";'
  );
});
