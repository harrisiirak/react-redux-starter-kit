import { CALL_API } from 'redux-api-middleware';
import { withSideEffects } from 'redux-action-side-effects';

import { API_REQUEST_START, API_REQUEST_SUCCESS, API_REQUEST_ERROR } from '../constants/api';

export function getEndpointForPath (path) {
  return [ __API_URL__, path ].join(path.length && path[0] === '/' ? '' : '/');
}

export function getDefaultHeaders () {
  return {};
}

export function createRequest (endpoint, method = 'GET', headers = {}, body = null, contextHandlers = {}) {
  // Set default handlers
  let handlers = {
    init: [
      {
        type: API_REQUEST_START,
        payload: (action, state) => {
          console.log(state);
          return action;
        }
      }
    ],

    success: [
      { type: API_REQUEST_SUCCESS }
    ],

    error: [
      { type: API_REQUEST_ERROR }
    ]
  };

  console.log(handlers);

  return {
    [CALL_API]: {
      endpoint: getEndpointForPath(endpoint),
      method: method,
      types: [
        withSideEffects(...handlers.init),
        withSideEffects(...handlers.success),
        withSideEffects(...handlers.error)
      ]
    }
  };
}
