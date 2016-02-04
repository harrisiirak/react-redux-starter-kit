import React, { PropTypes } from 'react';
import { routeActions } from 'react-router-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { createSession } from '../actions/session';

const fields = [ 'username', 'password' ];

export class LoginView extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,

    location: PropTypes.object,
    isAuthenticating: PropTypes.bool,
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
      return this.props.actions.createSession(values.username, values.password)
        .then(() => {
          resolve();
          this.props.dispatch(
            routeActions.push('/app')
          );
        }, (err) => {
          reject({ _error: err.message });
        });
    });
  }

  render () {
    const { fields: { username, password }, error, handleSubmit, submitting } = this.props;
    return (
      <div className='col-xs-12 col-md-6 col-md-offset-3'>
        <h3>Log in to view protected content!</h3>
        {error ? <div className='alert alert-info'>{error}</div> : ''}
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
  isAuthenticating: state.session.isAuthenticating,
  error: state.session.error
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ createSession }, dispatch)
});

export default reduxForm({
  form: 'login',
  fields
}, mapStateToProps, mapDispatchToProps)(LoginView);

//export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
