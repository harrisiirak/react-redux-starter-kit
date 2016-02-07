import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import Root from './containers/Root';
import configureRoutes from './routes';
import configureStore from './reducers/configureStore';

const historyConfig = { basename: __BASENAME__ };
const history = useRouterHistory(createHistory)(historyConfig);

let initialState = window.__INITIAL_STATE__ || {};

// Override initial state data
if (cookie.load('token') && cookie.load('token').length) {
  initialState = Object.assign(initialState, {
    api: {
      isValidToken: true,
      requireAuthorization: false,
      token: cookie.load('token'),
      resetReason: '',
      error: ''
    }
  });
}

const store = configureStore({ initialState, history });
const routes = configureRoutes(store);

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
);
