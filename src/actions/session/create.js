import fetch from 'isomorphic-fetch';
import {
  SESSION_CREATE_REQUEST, SESSION_CREATE_SUCCESS, SESSION_CREATE_FAILURE, SESSION_DESTROY_SUCCESS
} from '../../constants/session';

function requestLogin (creds) {
  return {
    type: SESSION_CREATE_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  };
}

function receiveLogin (user) {
  return {
    type: SESSION_CREATE_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    token: user.token
  };
}

function loginError (message) {
  return {
    type: SESSION_CREATE_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  };
}

export function createSession (username, password) {
  let config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin({ username, password }));

    return fetch(__API_URL__ + '/sessions/create', config)
      .then(response =>
        response.json().then(user => ({ user, response }))
      ).then(({ user, response }) => {
        if (!response.ok) {
          dispatch(loginError(user.message));
          return Promise.reject(user);
        } else {
          localStorage.setItem('token', user.data || user.token);
          dispatch(receiveLogin(user));
        }
      }).catch(() => {
        let err = loginError('Invalid response from the server. Cannot create a new session');
        dispatch(err);

        return Promise.reject(err);
      });
  };
}
