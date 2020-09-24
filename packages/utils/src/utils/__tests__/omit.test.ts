import { omit } from '../omit';

test('it should omit the specified props', () => {
  expect(omit({ foo: 'a', bar: 'b' }, ['foo'])).toStrictEqual({
    bar: 'b'
  });
});
