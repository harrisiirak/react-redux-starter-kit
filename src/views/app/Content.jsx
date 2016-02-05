import React from 'react';
import { Link } from 'react-router';

export default class Content extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-3 col-md-2 sidebar'>
            <ul className='nav nav-sidebar'>
              <li><Link to="/app" activeClassName="active">Dashboard</Link></li>
              <li><Link to="/app/users" activeClassName="active">Users</Link></li>
            </ul>
            <ul className='nav nav-sidebar'>
              <li><a href=''>Nav item</a></li>
            </ul>
          </div>
          <div className='col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
