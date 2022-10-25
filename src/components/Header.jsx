import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../services/userAPI';
import Loading from './Loading';

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      name: '',
    };
  }

  componentDidMount() {
    this.getUsername();
  }

  getUsername = async () => {
    const { name } = await getUser();
    this.setState({
      loading: false,
      name,
    });
    return name;
  }

  render() {
    const { loading, name } = this.state;
    return (
      <div>
        { loading
          ? <Loading />
          : (
            <header data-testid="header-component" className="header-container">
              <div className="header-info">
                <h2>
                  TrybeTunes
                  <img src="https://camo.githubusercontent.com/3d6b7feb98226a20c89ca81a274114e99a3fb35dcefebda4eb551c8ea1842b3a/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f353538383235322f313234383039382f30383961646464652d326163382d313165332d383333662d6434663234366533323662392e706e67" alt="logo" className="icon-logo" />
                </h2>
                <span className="user-name-header">
                  <p data-testid="header-user-name">{ name }</p>
                </span>
              </div>
              <nav className="header-nav-link">
                <Link
                  to="/search"
                  data-testid="link-to-search"
                  className="link"
                >
                  Pesquisa
                </Link>
                <Link
                  to="/favorites"
                  data-testid="link-to-favorites"
                  className="link"
                >
                  Favoritas
                </Link>
                <Link
                  to="/profile"
                  data-testid="link-to-profile"
                  className="link"
                >
                  Perfil
                </Link>
              </nav>
            </header>
          )}
      </div>
    );
  }
}
