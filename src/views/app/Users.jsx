import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchAllUsers } from '../../actions/user';

class Users extends React.Component {
  constructor (props) {
    super(props);
  }

  componentWillMount () {
    this.props.actions.fetchAllUsers()
      .then(({ response, data }) => {
        console.log(data,response);
        this.setState({
          users: data
        });
      }, (err) => {
        console.log('ERROR',err);
      });
  }

  render () {
    return (
      <div>Users!</div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ fetchAllUsers }, dispatch)
});

export default connect((state) => ({}), mapDispatchToProps)(Users);
