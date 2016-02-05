import * as constants from '../../constants/session';
import { routeActions } from 'react-router-redux';

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
// TODO: Should call session destroy endpoint
export function destroySession (reason) {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem('token');
    dispatch(receiveLogout());
    dispatch(routeActions.push('/login?reason=' + (reason || 'user')));
  };
}
