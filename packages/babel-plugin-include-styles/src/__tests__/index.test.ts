import { transform } from './helpers/utils';
import exists from '../exists';
import resolvePackage from '../resolve-package';

jest.mock('../exists.ts');
jest.mock('../resolve-package.ts');
jest.mock('@cgds/test/package.json', () => ({}), { virtual: true });

const resolveSpy = resolvePackage as jest.Mock
resolveSpy.mockReturnValue('@cgds/test/package.json')

test('should not change css import', () => {
  const source = 'import "@cgds/test/dist/main.css";';
  expect(transform(source)).toBe('import "@cgds/test/dist/main.css";');
});

test('should add css import', () => {
  // @ts-ignore
  exists.mockReturnValueOnce(true);
  const source = 'import Test from "@cgds/test";';
  expect(transform(source)).toBe(
    'import Test from "@cgds/test";\nimport "@cgds/test/dist/main.css";'
  );
});

test("shouldn't touch other imports", () => {
  // @ts-ignore
  exists.mockReturnValueOnce(true);
  const source = 'import Test from "@cgds/test";\nimport NotMe from "@test";';
  expect(transform(source)).toBe(
    'import Test from "@cgds/test";\nimport "@cgds/test/dist/main.css";\nimport NotMe from "@test";'
  );
});

test('ensure only one css import is kept', () => {
  const source =
    'import Test from "@cgds/test";\nimport "@cgds/test/dist/main.css";import "@cgds/test/dist/main.css";';
  expect(transform(source)).toBe(
    'import Test from "@cgds/test";\nimport "@cgds/test/dist/main.css";'
  );
});

test("shouldn't add css import if already present - above", () => {
  const source =
    'import "@cgds/test/dist/main.css";\nimport Test from "@cgds/test";';
  expect(transform(source)).toBe(
    'import "@cgds/test/dist/main.css";\nimport Test from "@cgds/test";'
  );
});

test("shouldn't add css import if file doesn't exist", () => {
  // @ts-ignore
  exists.mockReturnValueOnce(false);
  const source = 'import Test from "@cgds/test";';
  expect(transform(source)).toBe('import Test from "@cgds/test";');
});

test("should work for other css imports", () => {
  // @ts-ignore
  exists.mockReturnValueOnce(false);
  const source = 'import "@cgds/some/dist/other.css";';
  expect(transform(source)).toBe(source);
});

test("should not fail for deeper imports", () => {
  // @ts-ignore
  exists.mockReturnValueOnce(false);
  const source = 'import "@cgds/some/dist/other.js";';
  expect(transform(source)).toBe(source);
});