import { CALL_API } from 'redux-api-middleware';
import { withSideEffects } from 'redux-action-side-effects';
import fetch from 'isomorphic-fetch';
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
      { type: API_REQUEST_SUCCESS }
    ],

    error: [
      { type: API_REQUEST_ERROR }
    ]
  }
};

function extendedConfigurationFromDefaults (contextConfig) {
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

  return config;
}

function dispatchHandlers (dispatch, handlers, state, payload, error = false, context = null) {
  // Don't fire same handlers set twice
  if (handlers._processed) {
    return;
  }

  let response = Object.assign({}, payload);

  handlers.forEach((handler) => {
    if (typeof handler.payload !== 'undefined') {
      let transformed;

      if (typeof handler.payload === 'function') {
        transformed = handler.payload({ type: handler.type, payload: response, error }, state, context);
      } else {
        transformed = handler.payload || undefined;
      }

      if (typeof transformed !== 'undefined') {
        response = Object.assign({}, transformed);
      }
    }

    dispatch({ type: handler.type, payload: response, error, context });
  });

  handlers._processed = true;
  return response;
}

export function createRequest (contextConfig, dispatch, state) {
  let config = extendedConfigurationFromDefaults(contextConfig);

  dispatchHandlers(dispatch, config.handlers.init, state, {});

  // Attach token
  if (state.api.isValidToken && state.api.token) {
    const headers = Object.assign({}, getDefaultHeaders(), contextConfig.headers || {});
    config.headers = Object.assign(headers, {
      'Authorization': `Bearer ${state.api.token}`
    });
  }

  return fetch(getEndpointForPath(config.endpoint), config)
    .then(response =>
      response.json().then(data => ({ data, response }))
    )
    .then(({ data, response }) => {
      let ret;

      if (!response.ok) {
        ret = dispatchHandlers(dispatch, config.handlers.error, state, data, true, response);
        return Promise.reject(new Error(ret.data.data ? ret.data.data : response.statusText));
      }

      ret = dispatchHandlers(dispatch, config.handlers.success, state, data, false, response);
      return Promise.resolve({ response, data: ret.data });
    }).catch((err) => {
      dispatchHandlers(dispatch, config.handlers.error, state);
      return Promise.reject(err);
    });
}

export function createRequestMiddleware (contextConfig) {
  let config = extendedConfigurationFromDefaults(contextConfig);
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
