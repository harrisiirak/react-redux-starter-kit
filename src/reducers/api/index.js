import {
  API_REQUEST_START, API_REQUEST_SUCCESS, API_REQUEST_ERROR, API_TOKEN_INITIALIZE, API_TOKEN_RESET
} from '../../constants/api';

const initialState = {
  isAuthTokenValid: false,
  requireAuthorization: false,
  token: '',
  errorReason: '', // invalid
  error: ''
};

function api (state = initialState, action) {
  switch (action.type) {
    case API_TOKEN_INITIALIZE:
      return Object.assign({}, state, {
        isAuthTokenValid: true,
        token: action.token
      });

    case API_REQUEST_ERROR:
      if (action.error) {
        let status = action.payload.status;
        let nextState = Object.assign({}, state, {
          errorReason: 'invalid',
          error: action.payload.response.data
        });

        // Handle invalid token or login
        if (status && status === 401) {
          nextState.isAuthTokenValid = false;
          nextState.requireAuthorization = true;
        }

        return nextState;
      }
      break;

    case API_REQUEST_START:
    case API_TOKEN_RESET:
      return initialState;
  }

  return state;
}

export default api;
