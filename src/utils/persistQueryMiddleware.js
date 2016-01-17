import updateQueryString from './updateQueryString';
import { INIT_PERSIST_QUERY } from '../index';
import { createHistory } from 'history';

let history = null;

if (global.window) {
  history = createHistory();
}

export default function persistQueryMiddleware(store, config) {
  return next => action => {
    next(action);

    if (
      action.type !== INIT_PERSIST_QUERY &&
      action.type !== '@@router/INIT_PATH' &&
      action.type !== '@@router/UPDATE_PATH'
    ) {
      const { key, encoder, slicer, pushState } = config;
      const state = slicer(store.getState());
      const query = updateQueryString(window.location.hash, key, encoder(state));

      if (pushState) {
        pushState(query);
      } else {
        history.pushState(null, query);
      }
    }

    return action;
  };
}
