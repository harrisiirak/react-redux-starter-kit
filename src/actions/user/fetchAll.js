import { CALL_API } from 'redux-api-middleware';
import { withSideEffects } from 'redux-action-side-effects';
import { API_REQUEST_START, API_REQUEST_ERROR } from '../../constants/api';

export function fetchAll () {
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
