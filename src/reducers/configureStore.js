import { applyMiddleware, compose, createStore } from 'redux';
import { syncHistory } from 'react-router-redux';
import { apiMiddleware } from 'redux-api-middleware';
import { processSideEffects } from 'redux-action-side-effects';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import rootReducer from './rootReducer';

export default function configureStore ({ initialState = {}, history }) {
  // Sync with router via history instance (main.js)
  const routerMiddleware = syncHistory(history);
  const logger = createLogger();

  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk, promise, apiMiddleware, routerMiddleware, logger);
  if (__DEBUG__) {
    const devTools = window.devToolsExtension
      ? window.devToolsExtension()
      : require('containers/DevTools').default.instrument();
    middleware = compose(middleware, processSideEffects, devTools);
  }

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState);
  if (__DEBUG__) routerMiddleware.listenForReplays(store, ({ router }) => router.location);

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
