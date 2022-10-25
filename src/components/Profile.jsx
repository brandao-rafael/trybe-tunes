import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { getUser } from '../services/userAPI';
import Loading from './Loading';

export default class Profile extends Component {
  state={
    loading: true,
    userInfo: {},
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const userInfo = await getUser();
    this.setState({
      userInfo: { ...userInfo },
    }, () => {
      this.setState({
        loading: false,
      });
    });
  }

  render() {
    const { loading, userInfo } = this.state;
    const { name, email, image, description } = userInfo;
    return (
      <>
        <Header />
        <div data-testid="page-profile">
          {loading ? <Loading /> : (
            <div className="profile-container">
              <img src={ image } alt={ name } data-testid="profile-image" />
              <h4>{name}</h4>
              <p>{email}</p>
              <p>{description}</p>
              <button type="button" className="btn btn-outline-success">
                <Link
                  to="/profile/edit"
                  className="edit-profile-link"
                >
                  Editar perfil
                </Link>
              </button>
            </div>
          )}
        </div>
      </>
    );
  }
}
