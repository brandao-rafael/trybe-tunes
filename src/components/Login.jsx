import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { createUser } from '../services/userAPI';
import Loading from './Loading';

const MIN_LENGTH = 2;
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      disabled: true,
      name: '',
      loading: false,
    };
  }

  submitClicked = async () => {
    this.setState({ loading: true });
    const { name } = this.state;
    const { history } = this.props;
    await createUser({ name });
    history.push('./search');
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      name: value,
      disabled: (value.length <= MIN_LENGTH),
    });
  }

  render() {
    const { name, disabled, loading } = this.state;
    return (

      <div data-testid="page-login">
        {loading
          ? <Loading />
          : (
            <>
              <h1 className="login-title">Login</h1>
              <div className="input-group mb-3 login-control">
                <label htmlFor="name-input">
                  <input
                    aria-describedby="button-addon2"
                    aria-label="Recipient's username"
                    className="form-control"
                    placeholder="Digite seu nome"
                    type="text"
                    data-testid="login-name-input"
                    id="name-input"
                    name="name"
                    value={ name }
                    onChange={ this.handleChange }
                  />
                </label>
                <button
                  className="btn btn-outline-success"
                  id="button-addon2"
                  type="button"
                  disabled={ disabled }
                  data-testid="login-submit-button"
                  onClick={ this.submitClicked }
                >
                  Login
                </button>
              </div>

            </>
          )}
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    length: PropTypes.number,
    push: PropTypes.func,
  }).isRequired,
};
