const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongsActivities',
  version: '1.0.0',
  register: async (server, {
    PlaylistSongActivitiesServices,
    PlaylistsServices,
  }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      PlaylistSongActivitiesServices,
      PlaylistsServices,
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};
