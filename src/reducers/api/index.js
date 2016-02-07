import {
  API_REQUEST_START, API_REQUEST_SUCCESS, API_REQUEST_ERROR, API_TOKEN_INITIALIZE, API_TOKEN_RESET,
  API_TOKEN_REQUEST, API_TOKEN_REQUEST_ERROR
} from '../../constants/api';

import cookie from 'react-cookie';

const storedToken = cookie.load('token') || null;
const initialState = {
  isValidToken: !!storedToken,
  requireAuthorization: false,
  requestInProgress: false,
  token: storedToken,
  resetReason: '', // invalid
  error: ''
};

function api (state = initialState, action) {
  switch (action.type) {
    case API_TOKEN_REQUEST_ERROR:
      return Object.assign({}, state, {
        error: action.message
      });

    case API_TOKEN_INITIALIZE:
      return Object.assign({}, state, {
        isValidToken: true,
        token: action.token
      });

    case API_REQUEST_ERROR:
      if (action.error) {
        let status = action.context.status;
        let nextState = Object.assign({}, state, {
          requestInProgress: false,
          resetReason: 'invalid',
          error: action.payload.data
        });

        // Handle invalid token or login
        if (status && status === 401) {
          nextState.isValidToken = false;
          nextState.requireAuthorization = true;
        }

        return nextState;
      }
      break;

    case API_REQUEST_START:
      return Object.assign({}, state, {
        requestInProgress: true,
        resetReason: '',
        error: ''
      });

    case API_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        requestInProgress: false,
        resetReason: '',
        error: ''
      });

    case API_TOKEN_REQUEST:
    case API_TOKEN_RESET:
      return initialState;
  }

  return state;
}

export default api;
