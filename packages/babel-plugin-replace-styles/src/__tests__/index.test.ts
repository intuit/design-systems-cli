import { transform } from './helpers/utils';
import exists from '../exists';

jest.mock('../exists.ts');
jest.mock('@cgds/test/package.json', () => ({}), { virtual: true });

test('should not change css import', () => {
  const source = 'import "../main.css";';
  expect(transform(source)).toBe('import "../main.css";');
});

test('should change the import', () => {
  const source = 'import "../main.css";';
  // @ts-ignore
  exists.mockReturnValueOnce(true).mockReturnValueOnce(true);
  expect(transform(source, '@cgds/dist/test.js')).toBe('import "../test.css";');
});


test('should not change the import if the new file does not exist', () => {
  const source = 'import "../main.css";';
  // @ts-ignore
  exists.mockReturnValueOnce(true).mockReturnValueOnce(false);
  expect(transform(source, '@cgds/dist/test.js')).toBe('import "../test.css";');
});