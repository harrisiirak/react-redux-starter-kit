import React, { PropTypes } from 'react';
import { requireAuthentication } from '../components/AuthenticatedComponent';

import { Navigation } from './app/Navigation';
import { Content } from './app/Content';

console.log(Navigation);

export class Application extends React.Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='container col-md-12'>
        <Navigation />
        <Content />
      </div>
    );
  }
}

export default requireAuthentication(Application);
