import * as constants from '../../constants/session';

function requestLogout () {
  return {
    type: constants.SESSION_DESTROY_REQUEST,
    isFetching: true,
    isAuthenticated: true
  };
}

function receiveLogout () {
  return {
    type: constants.SESSION_DESTROY_REQUEST,
    isFetching: false,
    isAuthenticated: false
  };
}

// Logs the user out
export function destroySession () {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem('token');
    dispatch(receiveLogout());
    return Promise.resolve();
  };
}
