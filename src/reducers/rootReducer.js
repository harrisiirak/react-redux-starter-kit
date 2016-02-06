import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import api from './api';
import user from './user';

export default combineReducers({
  api,
  user,
  router,
  form: formReducer
});
