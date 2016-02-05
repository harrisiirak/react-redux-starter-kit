import {
  API_REQUEST_START, API_REQUEST_RESET, API_REQUEST_ERROR
} from '../../constants/api';

const initialState = {
  isAuthTokenValid: true,
  requireAuthorization: false,
  error: ''
};

function api (state = initialState, action) {
  switch (action.type) {
    case API_REQUEST_ERROR:
      if (action.error) {
        let status = action.payload.status;
        let nextState = Object.assign({}, state, {
          error: action.payload.response.data
        });

        // Handle invalid token or login
        if (status && status == 401) {
          nextState.isAuthTokenValid = false;
          nextState.requireAuthorization = true;
        }

        return nextState;
      }
      break;


    case API_REQUEST_START:
    case API_REQUEST_RESET:
      return initialState;
  }

  return state;
}

export default api;
