const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelPlaylistActivities } = require('../../utils/playlistActivies');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async postActivity(playlistId, songId, userId, action) {
    const id = `playlistSongActivity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlists_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Aktifitas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getActivitiesFromPlaylist(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlists_song_activities.action, playlists_song_activities.time FROM playlists_song_activities
          RIGHT JOIN users ON users.id = playlists_song_activities.user_id
          RIGHT JOIN songs ON songs.id = playlists_song_activities.song_id
          WHERE playlists_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('playlist Lagu tidak ditemukan');
    }
    return result.rows.map(mapDBToModelPlaylistActivities);
  }
}

module.exports = PlaylistSongActivitiesService;
