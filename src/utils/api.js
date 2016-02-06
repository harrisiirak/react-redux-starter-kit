import { CALL_API } from 'redux-api-middleware';
import { withSideEffects } from 'redux-action-side-effects';

import { API_REQUEST_START, API_REQUEST_SUCCESS, API_REQUEST_ERROR } from '../constants/api';

export function getEndpointForPath (path) {
  return [ __API_URL__, path ].join(path.length && path[0] === '/' ? '' : '/');
}

export function getDefaultHeaders () {
  return {};
}

const defaultConfig = {
  method: 'GET',
  headers: getDefaultHeaders(),
  handlers: {
    init: [
      { type: API_REQUEST_START }
    ],

    success: [
      { type: API_REQUEST_SUCCESS },
      { type: API_REQUEST_SUCCESS }
    ],

    error: [
      { type: API_REQUEST_ERROR }
    ]
  }
};

export function createRequest (contextConfig) {
  let config = Object.assign({}, defaultConfig, contextConfig);

  if (contextConfig.handlers) {
    Object.keys(defaultConfig.handlers).forEach((type) => {
      if (!contextConfig.handlers[type]) {
        config.handlers[type] = defaultConfig.handlers[type];
      } else {
        config.handlers[type] = defaultConfig.handlers[type].concat(
          contextConfig.handlers[type] instanceof Array ? contextConfig.handlers[type] : [ contextConfig.handlers[type] ]
        );
      }

      config.handlers[type].reverse();
    })
  }

  return {
    [CALL_API]: {
      endpoint: getEndpointForPath(config.endpoint),
      method: config.method,
      headers: function (state) {
        let headers = Object.assign({}, getDefaultHeaders(), contextConfig.headers || {});

        // Attach token
        if (state.api.isValidToken && state.api.token) {
          headers = Object.assign(headers, {
            'Authorization': `Bearer ${state.api.token}`
          });
        }

        return headers;
      },
      types: [
        withSideEffects(...config.handlers.init),
        withSideEffects(...config.handlers.success),
        withSideEffects(...config.handlers.error)
      ]
    }
  };
}
