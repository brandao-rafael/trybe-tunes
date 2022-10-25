import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import getMusics from '../services/musicsAPI';
import MusicCard from './MusicCard';
import Loading from './Loading';
import { addSong, getFavoriteSongs, removeSong } from '../services/favoriteSongsAPI';

export default class Album extends Component {
  state = {
    albumSongs: [],
    albumInformation: {},
    loading: false,
    favoriteSongId: [],
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.fetchMusic(id);
    this.getFromFavorite();
  }

  fetchMusic = async (id) => {
    this.setState({ loading: true });
    const albumResults = await getMusics(id);
    const { albumSongs } = this.state;
    albumResults.forEach((result, i) => ((i === 0)
      ? this.setAlbumInformation(result)
      : albumSongs.push(result)));
    this.setState({
      loading: false,
    });
  }

  fetchToFavorite = async ({ target }, obj) => {
    const { favoriteSongId } = this.state;
    if (target.checked) {
      this.setState({ loading: true });
      await addSong(obj);
      this.setState({
        loading: false,
        favoriteSongId: [...favoriteSongId, obj.trackId],
      });
    } else {
      this.setState({ loading: true });
      await removeSong(obj);
      this.setState({
        loading: false,
        favoriteSongId: favoriteSongId.filter((id) => id !== obj.trackId),
      });
    }
  }

  getFromFavorite = async () => {
    const { favoriteSongId } = this.state;
    this.setState({ loading: true });
    const result = await getFavoriteSongs();
    this.setState({
      loading: false,
      favoriteSongId: [...favoriteSongId, ...result.map((song) => song.trackId)],
    });
  }

  setAlbumInformation = (info) => {
    this.setState({
      albumInformation: info,
    }, () => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { albumInformation,
      albumSongs,
      loading,
      favoriteSongId,

    } = this.state;

    return (
      <>
        <Header />
        <div data-testid="page-album">
          { loading ? <Loading />
            : (
              <>
                <div className="album-title">
                  <h3 data-testid="artist-name">{albumInformation.artistName}</h3>
                  <img
                    src={ albumInformation.artworkUrl100 }
                    alt={ albumInformation.collectionName }
                    className="collection-image-album"
                  />
                  <h4 data-testid="album-name">{albumInformation.collectionName}</h4>
                </div>
                <div className="album-cards-container">
                  {albumSongs.map((song) => (
                    <MusicCard
                      previewUrl={ song.previewUrl }
                      trackName={ song.trackName }
                      trackId={ song.trackId }
                      checked={ favoriteSongId
                        .some((favSong) => song.trackId === favSong) }
                      fetchToFavorite={ this.fetchToFavorite }
                      songObj={ song }
                      key={ song.trackNumber }
                    />))}
                </div>
              </>
            )}
        </div>
      </>
    );
  }
}

Album.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  params: PropTypes.objectOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
};
