import test from 'tape';
import { compose, createStore } from 'redux';
import persistQueryMiddleware from '../src/utils/persistQueryMiddleware';
import { INIT_PERSIST_QUERY } from '../src/index';

const persistQuery = (config) => {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    const dispatch = persistQueryMiddleware(store, config)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
};

test('Utils - persistQueryMiddleware', t => {
  t.test('Receive Action', st => {
    st.plan(1);

    window.location.hash = '';

    const action = {
      type: 'EXAMPLE_EVENT',
    };

    const config = {
      key: 'q',
      slicer: (state) => state.example,
      encoder: val => val,
      pushState: query => {
        window.location.hash = `/${ query }`;
      },
    };

    const store = compose(
      persistQuery(config),
    )(createStore)(val => val, { example: 'hello' });

    store.dispatch(action);

    st.equal(
      window.location.hash, `#/?q=${ config.slicer(store.getState()) }`,
      'when an event occurs window.location.hash will contain the required slice of the store'
    );
  });

  t.test('Ignore Action', st => {
    st.plan(1);

    const action = {
      type: INIT_PERSIST_QUERY,
    };

    window.location.hash = '';

    const config = {
      key: 'q',
      slicer: (state) => state.example,
      encoder: val => val,
      pushState: query => {
        window.location.hash = `/${ query }`;
      },
    };

    const store = compose(
      persistQuery(config),
    )(createStore)(val => val, { example: 'hello' });

    store.dispatch(action);

    st.equal(
      window.location.hash, '',
      'when an ignored event occurs, the query will not be updated'
    );
  });
});
