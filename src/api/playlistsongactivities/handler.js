const autoBind = require('auto-bind');

class PlaylistSongActivitiesHandler {
  constructor(playlistsongactivitiesservice, playlistService) {
    this._playlistsongactivitiesservice = playlistsongactivitiesservice;
    this._playlistsService = playlistService;

    autoBind(this);
  }

  async getActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );

    const activities = await this._playlistsongactivitiesservice.getActivitiesFromPlaylist(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities: activities.map((activity) => ({
          username: activity.username,
          title: activity.title,
          action: activity.action,
          time: activity.time,
        })),
      },
    };
  }
}
module.exports = PlaylistSongActivitiesHandler;
