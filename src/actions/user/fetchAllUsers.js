import { API_REQUEST_START, API_REQUEST_ERROR } from '../../constants/api';
import { createRequest } from '../../utils/api';
import { CALL_API } from 'redux-api-middleware';
export function fetchAllUsers () {
  return {
    [CALL_API]: {
      endpoint: __API_URL__ + '/api/users',
      method: 'GET',
      types: [
        { type: API_REQUEST_START },
        { type: 'FETCH_USER_SUCCESS' },
        { type: API_REQUEST_ERROR }
      ]
    }
  };
}
