const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongsActivities',
  version: '1.0.0',
  register: async (server, {
    PlaylistSongActivities,
    PlaylistsServices,
  }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      PlaylistSongActivities,
      PlaylistsServices,
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};
