/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongHandler {
  constructor(
    playlistSongActivityService,
    PlaylistSongServices,
    songsService,
    PlaylistsServices,
    validator,
  ) {
    this._playlistSongActivityService = playlistSongActivityService;
    this._playlistSongsService = PlaylistSongServices;
    this._playlistsService = PlaylistsServices;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postplaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongsService.verifySong(songId);
    await this._playlistSongsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistSongId = await this._playlistSongsService.addPlaylistSong(
      playlistId,
      songId,
    );

    // activity
    await this._songsService.getSongById(songId);
    await this._playlistSongsService.postActivity(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    const response = h.response({
      status: 'success',
      message: 'berhasil menambahkan lagu ke playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );

    const playlist = await this._playlistsService.getPlaylistById(
      credentialId,
      playlistId,
    );

    const songs = await this._songsService.getSongsByPlaylistId(playlistId);
    playlist.songs = songs;

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongByIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._songsService.getSongById(songId);
    await this._playlistSongActivityService.postActivity(
      playlistId,
      songId,
      credentialId,
      'delete',
    );

    const owner = await this._playlistsService.getOwnerPlaylistById(playlistId);
    if (owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak menghapus lagu di playlist');
    }

    await this._playlistSongsService.deletePlaylistSong(songId);
    return {
      status: 'success',
      message: 'Lagu pada playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongHandler;
