import { routeActions } from 'react-router-redux';
import fetch from 'isomorphic-fetch';

import { API_TOKEN_INITIALIZE, API_TOKEN_RESET, API_TOKEN_REQUEST, API_TOKEN_REQUEST_ERROR } from '../../constants/api';
import { getEndpointForPath } from '../../utils/api';

function requestAPIToken (credentials) {
  return {
    type: API_TOKEN_REQUEST,
    credentials: credentials
  };
}

function receiveAPITokenError (error) {
  return {
    type: API_TOKEN_REQUEST_ERROR,
    error
  };
}

function receiveAPIToken (token) {
  return {
    type: API_TOKEN_INITIALIZE,
    token: token
  };
}

function requestAPITokenReset (reason) {
  return {
    type: API_TOKEN_RESET,
    resetReason: reason
  };
}

export function createAPIToken (username, password) {
  let config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestAPIToken({ username, password }));

    return fetch(getEndpointForPath('/sessions/create'), config)
      .then(response =>
        response.json().then(user => ({ user, response }))
      ).then(({ user, response }) => {
        if (!response.ok) {
          dispatch(receiveAPITokenError(user.data));
          return Promise.reject(user);
        } else {
          let token = user.data || user.token;

          if (localStorage) {
            localStorage.setItem('token', token);
          }

          dispatch(receiveAPIToken(token));
        }
      }).catch((a) => {
        let err = receiveAPITokenError('Invalid response from the server. Cannot create a new session');
        dispatch(err);

        return Promise.reject(err);
      });
  };
}

export function resetAPIToken (reason) {
  return dispatch => {
    dispatch(requestAPITokenReset(reason));

    if (localStorage) {
      localStorage.removeItem('token');
    }

    dispatch(routeActions.push('/login?reason=' + (reason || 'user')));
  };
}

