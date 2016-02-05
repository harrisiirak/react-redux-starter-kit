import {
  SESSION_CREATE_REQUEST, SESSION_CREATE_SUCCESS, SESSION_CREATE_FAILURE, SESSION_DESTROY_SUCCESS
} from '../../constants/session';

const initialState = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('token') && localStorage.getItem('token').length > 0,
  message: ''
};

function session (state = initialState, action) {
  switch (action.type) {
    case SESSION_CREATE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      });
    case SESSION_CREATE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: ''
      });
    case SESSION_CREATE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: action.message
      });

    case SESSION_DESTROY_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      });
    default:
      return state;
  }
}

export default session;
