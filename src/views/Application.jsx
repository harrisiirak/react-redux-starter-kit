import React, { PropTypes } from 'react';
import { requireAuthentication } from '../components/AuthenticatedComponent';
import { bindActionCreators } from 'redux';
import { routeActions } from 'react-router-redux';
import { connect } from 'react-redux';
import { destroySession } from '../actions/session';

import Navigation from './app/Navigation';
import Content from './app/Content';

export class Application extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  onLogout () {
    this.props.actions.destroySession()
      .then(() => {
        this.props.dispatch(routeActions.push('/login'));
      });
  }

  render () {
    return (
      <div id='app'>
        <Navigation onLogout={this.onLogout.bind(this)}/>
        <Content />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ destroySession }, dispatch)
});

export default requireAuthentication(
  connect((state) => ({}), mapDispatchToProps)(Application)
);
