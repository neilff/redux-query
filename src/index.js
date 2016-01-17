import invariant from 'invariant';
import { encode, decode } from 'base-64';
import parseQueryString from './utils/parseQueryString';
import persistQueryMiddleware from './utils/persistQueryMiddleware';

export const INIT_PERSIST_QUERY = '@@reduxPersistQuery/INIT';

/**
 * A store enhancer for persisting state to the URL.
 *
 * @return {Function} Store enhancer function
 */
export default function persistQuery(options) {
  const config = {
    key: 'q',
    encoder: (str) => encode(JSON.stringify(str)),
    decoder: (str) => JSON.parse(decode(str)),
    slicer: (state) => state,
    ...options,
  };

  invariant(
    config.key && typeof config.key === 'string',
    'persistQuery: Please provide a string for the key property.'
  );

  invariant(
    config.encoder && typeof config.encoder === 'function' &&
    config.decoder && typeof config.decoder === 'function',
    'persistQuery: The encoder and decoder properties must be a function.'
  );

  invariant(
    config.slicer && typeof config.slicer === 'function',
    'persistQuery: The slicer property must be a function.'
  );

  const parsedQuery = parseQueryString(window.location.search, config.key);

  let decodedInitialState = null;

  if (parsedQuery && typeof parsedQuery === 'string') {
    try {
      decodedInitialState = config.decoder(parsedQuery);
    } catch (e) {
      throw new Error('The decoder function was unable to decode the query string', e);
    }
  }

  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    const dispatch = persistQueryMiddleware(store, config)(store.dispatch);

    dispatch({
      type: INIT_PERSIST_QUERY,
      payload: decodedInitialState,
    });

    return {
      ...store,
      dispatch,
    };
  };
}
