import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import Loading from './Loading';

const MIN_LENGTH = 1;
export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      disabled: true,
      value: '',
      albums: [],
      loading: false,
      name: '',
    };
  }

  handlerEvent = ({ target }) => {
    const { value } = target;
    this.setState({
      value,
      disabled: (value.length <= MIN_LENGTH),
      name: value,
    });
  }

  fetchApi = async () => {
    this.setState({ loading: true });
    const { value } = this.state;
    const results = await searchAlbumsAPI(value);
    this.setState({
      albums: results,
      value: '',
      loading: false,
    });
  }

  render() {
    const { value, disabled, loading, albums, name } = this.state;
    return (
      <>
        <Header />
        <div data-testid="page-search" className="page-search">
          {loading ? <Loading /> : (
            <div className="page-search-controls">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquise por artista"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  data-testid="search-artist-input"
                  name="search-artist"
                  onChange={ this.handlerEvent }
                  value={ value }
                />
                <button
                  className="btn btn-outline-success"
                  type="button"
                  id="button-addon2"
                  data-testid="search-artist-button"
                  disabled={ disabled }
                  onClick={ this.fetchApi }
                >
                  Pesquisar
                </button>
              </div>
            </div>)}
          {albums.length > 0 ? (
            <>
              <h4 className="title-album-item">
                {`Resultado de álbuns de: ${name}
                `}
              </h4>
              <div className="search-container">
                {albums.map((album) => (
                  <div className="album-item" key={ album.collectionId }>
                    <img
                      src={ album.artworkUrl100 }
                      alt={ album.collectionName }
                      className="album-img"
                    />
                    <div>
                      <h5 className="album-name">{album.collectionName}</h5>
                      <p>{album.artistName}</p>
                      <Link
                        to={ `/album/${album.collectionId}` }
                        data-testid={ `link-to-album-${album.collectionId}` }
                        className="link-to-album"
                      >
                        View
                      </Link>
                    </div>
                  </div>))}
              </div>

            </>
          ) : (
            <h5 className="none-album">
              Nenhum álbum foi encontrado
            </h5>
          )}
        </div>
      </>
    );
  }
}
