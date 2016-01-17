import test from 'tape';
import updateQueryString from '../src/utils/updateQueryString';

test('Utils - updateQueryString', t => {
  t.plan(4);

  t.equal(
    updateQueryString('#/?q=hello%20world&k=test&b=moretest', 'q', 'newstuff'),
    '#/?q=newstuff&k=test&b=moretest',
    'updates the provided query string with the new key value'
  );

  t.equal(
    updateQueryString('?q=hello%20world&bill=test', 'q', 'newstuff'),
    '?q=newstuff&bill=test',
    'updates the provided string if it is missing the hash'
  );

  t.equal(
    updateQueryString('#/?bill=test', 'q', 'newstuff'),
    '#/?bill=test&q=newstuff',
    'adds the new property if it does not already contain it'
  );

  t.equal(
    updateQueryString('#/', 'q', 'newstuff'),
    '#/?q=newstuff',
    'adds the query string if it does not contain one'
  );
});
