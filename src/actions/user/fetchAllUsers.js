import { API_REQUEST_START, API_REQUEST_ERROR } from '../../constants/api';
import { USERS_ALL } from '../../constants/user';
import { createRequest } from '../../utils/api';

export function fetchAllUsers () {
  return (dispatch, getState) => {
    return createRequest({
      endpoint: '/api/users',
      handlers: {
        success: { type: USERS_ALL, payload: (action, state, res) => {
          let payload = Object.assign({}, action.payload);

          payload.data.forEach((user) => {
            user.id = Math.random();
          });

          return payload;
        } },
        error: { type: 'ERRORRR', payload: (action, state, res) => action.payload }
      }
    }, dispatch, getState());
  };
}
