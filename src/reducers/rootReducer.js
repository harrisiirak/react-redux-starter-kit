import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import api from './api';
import session from './session';

export default combineReducers({
  api,
  session,
  router,
  form: formReducer
});
