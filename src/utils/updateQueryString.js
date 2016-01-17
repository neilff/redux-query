/**
 * Returns a modified URI with the updated key / value
 *
 * @param {String} uri URI
 * @param {String} key Key to modify
 * @param {String} value Value to set
 * @return {String} Modified URI
 */
export default function updateQueryString(uri, key, value) {
  const re = new RegExp('([?&])' + key + '=[^&]*', 'i');
  const separator = /[?]/.test(uri) ? '&' : '?';

  return re.test(uri)
    ? uri.replace(re, '$1' + key + '=' + value)
    : uri + separator + key + '=' + value;
}
