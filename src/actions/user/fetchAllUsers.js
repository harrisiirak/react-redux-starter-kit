import { API_REQUEST_START, API_REQUEST_ERROR } from '../../constants/api';
import { USERS_ALL } from '../../constants/user';
import { createRequest } from '../../utils/api';

export function fetchAllUsers () {
  return createRequest({
    endpoint: '/api/users',
    handlers: {
      success: { type: USERS_ALL }
    }
  });
}
