import test from 'tape';
import { compose, createStore, combineReducers } from 'redux';
import persistQuery, { INIT_PERSIST_QUERY } from '../src/index';
import { createHistory } from 'history';

global.history = createHistory();

test('persistQuery', t => {
  t.test('Invalid Init', st => {
    st.plan(1);

    window.location.hash = '/?q=hello-world';

    const config = {
      key: 'q',
      slicer: (state) => state.example,
      encoder: val => val,
    };

    const generateStore = () => {
      return compose(
        persistQuery(config),
      )(createStore)(val => val, {});
    };

    st.throws(
      generateStore, /decoder function was unable to decode the query string/,
      'throws error when an invalid initial state is used'
    );
  });

  t.test('Successful Init', st => {
    st.plan(1);

    window.location.hash = `/?q=${ JSON.stringify({hello: 'world'}) }`;

    const config = {
      key: 'q',
      slicer: (state) => state.example,
      encoder: val => val,
      decoder: val => JSON.parse(val),
    };

    const rootReducer = combineReducers({
      example: function exampleReducer(state = {}, action = {}) {
        switch (action.type) {

          case INIT_PERSIST_QUERY:
            state.example = action.payload;
            return state;

          default:
            return state;
        }
      },
    });

    const generateStore = () => {
      return compose(
        persistQuery(config),
      )(createStore)(rootReducer, {});
    };

    const store = generateStore();

    st.equal(
      store.getState().example.hello, 'world',
      'loads initial state from the query string'
    );
  });

  t.test('Action', st => {
    st.plan(2);

    const ACTION = 'EXAMPLE_ACTION';

    window.location.hash = '';

    const config = {
      key: 'q',
      slicer: (state) => state.example,
      encoder: val => JSON.stringify(val),
      decoder: val => JSON.parse(val),
      pushState: query => {
        window.location.hash = `/${ query }`;
      },
    };

    const rootReducer = combineReducers({
      example: function exampleReducer(state = {}, action = {}) {
        switch (action.type) {

          case ACTION:
            state.example = action.payload;
            return state;

          default:
            return state;
        }
      },
    });

    const generateStore = () => {
      return compose(
        persistQuery(config),
      )(createStore)(rootReducer, {});
    };

    const store = generateStore();

    store.dispatch({
      type: ACTION,
      payload: {
        hello: 'world',
      },
    });

    st.equal(
      store.getState().example.hello, 'world',
      'will modify the stores state with an action'
    );

    st.equal(
      window.location.hash, '#/?q={"hello":"world"}',
      'persist the state in the query string'
    );
  });
});
