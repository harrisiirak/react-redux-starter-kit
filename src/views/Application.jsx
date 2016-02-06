import React, { PropTypes } from 'react';
import { requireAuthentication } from '../components/AuthenticatedComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { destroySession } from '../actions/session';
import { fetchAllUsers } from '../actions/user';

import Navigation from './app/Navigation';
import Content from './app/Content';

export class Application extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    dispatch: PropTypes.func,
    children: PropTypes.element
  };

  constructor (props) {
    super(props);

    /*
    setTimeout(() => {
      this.props.dispatch(fetchAllUsers());
    }, 5000);
    */
  }

  onLogout () {
    this.props.actions.destroySession();
  }

  render () {
    return (
      <div id='app'>
        <Navigation onLogout={this.onLogout.bind(this)}/>
        <Content>{this.props.children}</Content>
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
