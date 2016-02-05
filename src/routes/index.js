import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import CoreLayout from 'layouts/CoreLayout';
import Application from 'views/Application';
import Login from 'views/Login';
import NotFound from 'views/NotFound';

import { API_REQUEST_RESET } from '../constants/api';
import { destroySession } from '../actions/session';

export default function configureRoutes (store) {
  let isResetting = false;
  let requireAuth = (nextState, transition, cb) => {
    let isAuthenticated = store.getState().session.isAuthenticated;
    if (!isAuthenticated) {
      transition('/login');
    } else if (isAuthenticated && !nextState.location.pathname.startsWith('/app')) {
      transition('/app');
    }

    cb();
  };

  store.subscribe(() => {
    var state = store.getState();

    // Force logout
    if (state.api) {
      if (!isResetting && state.api.requireAuthorization) {
        isResetting = true;
        store.dispatch(destroySession('invalid'));
        store.dispatch({ type: API_REQUEST_RESET });
      } else if (isResetting && !state.api.requireAuthorization) {
        isResetting = false;
      }
    }
  });

  return (
    <Route path='/' component={CoreLayout}>
      <IndexRoute onEnter={requireAuth}/>
      <Route path='/login' component={Login} />
      <Route path='/app' component={Application} />
      <Route path='/404' component={NotFound} />
      <Redirect from='*' to='/404' />
    </Route>
  );
}
