import { transform } from './helpers/utils';
import exists from '../exists';

jest.mock('../exists.ts');
jest.mock('@cgds/test/package.json', () => ({}), { virtual: true });

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
