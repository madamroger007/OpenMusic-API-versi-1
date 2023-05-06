const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    PlaylistSongActivitiesServices,
    PlaylistSongServices,
    songServices,
    PlaylistsServices,
    validator,
  }) => {
    const playlistSongHandler = new PlaylistSongHandler(
      PlaylistSongActivitiesServices,
      PlaylistSongServices,
      songServices,
      PlaylistsServices,
      validator,
    );
    server.route(routes(playlistSongHandler));
  },
};
