import React, { PropTypes } from 'react';
import { requireAuthentication } from '../components/AuthenticatedComponent';
import { routeActions } from 'react-router-redux';

export class ApplicationView extends React.Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>Hello world!</div>
    );
  }
}

export default requireAuthentication(ApplicationView);
