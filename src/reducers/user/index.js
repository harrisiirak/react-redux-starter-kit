import { USERS_ALL } from '../../constants/user';

const initialState = {
  list: {}
};

function user (state = initialState, action) {
  switch (action.type) {
    case USERS_ALL:
      return Object.assign({}, state, {
        list: action.payload
      });

    default:
      return state;
  }
}

export default user;
