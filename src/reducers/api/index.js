import {
  API_REQUEST_START, API_REQUEST_SUCCESS, API_REQUEST_ERROR, API_TOKEN_INITIALIZE, API_TOKEN_RESET,
  API_TOKEN_REQUEST, API_TOKEN_REQUEST_ERROR
} from '../../constants/api';

const storedToken = typeof localStorage !== 'undefined' && localStorage.getItem('token') ? localStorage.getItem('token') : null;
const initialState = {
  isValidToken: !!storedToken,
  requireAuthorization: false,
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
        let status = action.payload.status;
        let nextState = Object.assign({}, state, {
          resetReason: 'invalid',
          error: action.payload.response.data
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
    case API_TOKEN_REQUEST:
    case API_TOKEN_RESET:
      return initialState;
  }

  return state;
}

export default api;
