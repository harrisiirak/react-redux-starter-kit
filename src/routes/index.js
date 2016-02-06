import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import CoreLayout from 'layouts/CoreLayout';
import Application from 'views/Application';
import Login from 'views/Login';
import NotFound from 'views/NotFound';

import Users from 'views/app/Users';

import { resetAPIToken } from '../actions/api';
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
        store.dispatch(destroySession(state.api.errorReason));
        store.dispatch(resetAPIToken());
      } else if (isResetting && !state.api.requireAuthorization) {
        isResetting = false;
      }
    }
  });

  return (
    <Route path='/' component={CoreLayout}>
      <IndexRoute onEnter={requireAuth}/>
      <Route path='login' component={Login} />
      <Route path='app' component={Application}>
        <Route path='users' component={Users} />
      </Route>
      <Route path='404' component={NotFound} />
      <Redirect from='*' to='404' />
    </Route>
  );
}
