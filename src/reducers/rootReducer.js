import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import api from './api';

export default combineReducers({
  api,
  router,
  form: formReducer
});
