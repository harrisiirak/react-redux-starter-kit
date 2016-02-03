import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import session from './session';

export default combineReducers({
  session,
  router,
  form: formReducer
});
