import React, { PropTypes } from 'react';
import { routeActions } from 'react-router-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { createAPIToken } from '../actions/api';

const fields = [ 'username', 'password' ];

export class Login extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,

    location: PropTypes.object,
    actions: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor (props) {
    super(props);
    const redirectRoute = this.props.location.query.next || '/login';
    this.state = {
      username: '',
      password: '',
      redirectTo: redirectRoute
    };
  }

  submit (values) {
    return new Promise((resolve, reject) => {
      return this.props.actions.createAPIToken(values.username, values.password)
        .then(() => {
          this.props.dispatch(
            routeActions.push('/app')
          );
        }, (err) => {
          reject({ _error: err.message });
        });
    });
  }

  render () {
    let { fields: { username, password }, error, handleSubmit, submitting } = this.props;

    // Custom errors
    if (this.props.location.query.reason) {
      switch (this.props.location.query.reason) {
        case 'invalid':
          error = 'Invalid auth token. Please log in to refresh the token';
          break;
      }
    }

    return (
      <div className='col-xs-12 col-md-6 col-md-offset-3'>
        <h3>Admin area</h3>
        {error ? <div className='alert alert-warning'>{error}</div> : ''}
        <form onSubmit={handleSubmit(this.submit.bind(this))}>
          <div className='form-group'>
            <input type='text'
                   className='form-control input-lg'
                   placeholder='Email' { ...username }/>
          </div>
          <div className='form-group'>
            <input type='password'
                   className='form-control input-lg'
                   placeholder='Password' { ...password }/>
          </div>
          <button type='submit'
                  className='btn btn-lg'
                  disabled={submitting}>Submit</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.api.error
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ createAPIToken }, dispatch)
});

export default reduxForm({
  form: 'login',
  fields
}, mapStateToProps, mapDispatchToProps)(Login);
