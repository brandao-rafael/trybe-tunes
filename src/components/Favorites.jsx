import React, { Component } from 'react';
import Header from './Header';
import Loading from './Loading';
import MusicCard from './MusicCard';
import { addSong, getFavoriteSongs, removeSong } from '../services/favoriteSongsAPI';

export default class Favorites extends Component {
  state = {
    loading: true,
    savedSongs: [],
    favoriteSongId: [],
  }

  componentDidMount() {
    this.getFavoriteSongsFromLocalStorage();
  }

  getFavoriteSongsFromLocalStorage = async () => {
    const { savedSongs } = this.state;
    const favoriteSongs = await getFavoriteSongs();
    this.setState({
      favoriteSongId: [...savedSongs, ...favoriteSongs.map((song) => song.trackId)],
    }, () => {
      savedSongs.push(...favoriteSongs);
      this.setState({
        loading: false,
      });
    });
  }

  fetchToFavorite = async ({ target }, obj) => {
    const { favoriteSongId, savedSongs } = this.state;
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
      }, () => {
        this.setState({
          savedSongs: savedSongs.filter((songInfo) => songInfo !== obj),
          favoriteSongId: favoriteSongId.filter((id) => id !== obj.trackId),
        });
      });
    }
  }

  render() {
    const { loading, savedSongs, favoriteSongId } = this.state;

    return (
      <>
        <Header />
        <h1 className="favorites-title">Favoritas</h1>
        <div data-testid="page-favorites" className="page-favorites">
          {loading ? <Loading /> : (
            savedSongs.map((song) => (
              <MusicCard
                previewUrl={ song.previewUrl }
                trackName={ song.trackName }
                trackId={ song.trackId }
                checked={ favoriteSongId
                  .some((favSong) => song.trackId === favSong) }
                fetchToFavorite={ this.fetchToFavorite }
                songObj={ song }
                key={ song.trackNumber }
              />))
          )}
        </div>
      </>
    );
  }
}
