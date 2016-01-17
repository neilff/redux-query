/**
 * Parses a provided URI query string and retrieves the value of the
 * key provided.
 *
 * @param {String} haystack The hash string to search
 * @param {String} needle The query key to match
 * @return {String} The string found in the query
 */
export default function parseQueryString(haystack, needle) {
  const hashSplit = haystack.replace('#/', '')
                            .substr(haystack.indexOf('?') + 1)
                            .split('&');

  const result = hashSplit.find(i => {
    const keyVal = i.split('=');

    if (keyVal[0] === needle) {
      return true;
    }
  });

  return result && typeof result === 'string' ?
    result.split('=')[1] : null;
}
