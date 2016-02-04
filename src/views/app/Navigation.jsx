import React, { PropTypes } from 'react';
import { Link } from 'react-router';

class Navigation extends React.Component {
  static propTypes = {
    onLogout: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  logout () {
    this.props.onLogout();
  }

  render () {
    return (
      <nav className='navbar navbar-inverse navbar-fixed-top'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className='navbar-brand' href='#'>Project name</a>
          </div>
          <div id='navbar' className='navbar-collapse collapse'>
            <ul className='nav navbar-nav navbar-right'>
              <li><Link to='/app'>Dashboard</Link></li>
              <li><Link to='/app/settings'>Settings</Link></li>
              <li><a onClick={this.logout.bind(this)}>Logout</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;
