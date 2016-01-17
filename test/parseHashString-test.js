import test from 'tape';
import parseHashString from '../src/utils/parseHashString';

test('Utils - parseHashString', t => {
  t.plan(4);

  t.equal(
    parseHashString('#/?q=hello%20world&k=test&b=moretest', 'q'), 'hello%20world',
    'returns the provided property from the query string'
  );

  t.equal(
    parseHashString('?q=hello', 'q'), 'hello',
    'returns the property if there is no hash'
  );

  t.equal(
    parseHashString('#/?q=hello%20world', null), null,
    'returns null if nothing is found'
  );

  t.equal(
    parseHashString('', 'q'), null,
    'returns null if the query string empty'
  );
});
