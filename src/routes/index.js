import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import CoreLayout from 'layouts/CoreLayout';
import ApplicationView from 'views/ApplicationView';
import LoginView from 'views/LoginView';
import NotFoundView from 'views/NotFoundView/NotFoundView';

export default function configureRoutes (store) {
  var requireAuth = (nextState, transition, cb) => {
    let isAuthenticated = store.getState().session.isAuthenticated;
    if (!isAuthenticated) {
      transition('/login');
    } else if (isAuthenticated && !nextState.location.pathname.startsWith('/app')) {
      transition('/app');
    }

    cb();
  };

  return (
    <Route path='/' component={CoreLayout}>
      <IndexRoute onEnter={requireAuth}/>
      <Route path='/login' component={LoginView} />
      <Route path='/app' component={ApplicationView} />
      <Route path='/404' component={NotFoundView} />
      <Redirect from='*' to='/404' />
    </Route>
  );
}
