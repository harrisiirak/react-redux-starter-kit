import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import CoreLayout from 'layouts/CoreLayout';
import Application from 'views/Application';
import Login from 'views/Login';
import NotFound from 'views/NotFound';

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
      <Route path='/login' component={Login} />
      <Route path='/app' component={Application} />
      <Route path='/404' component={NotFound} />
      <Redirect from='*' to='/404' />
    </Route>
  );
}
