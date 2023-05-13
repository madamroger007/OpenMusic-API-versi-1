const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'album_likes',
  version: '1.0.0',
  register: async (server, {
    albumLikesServices,
    albumServices,
  }) => {
    const albumLikesHandler = new AlbumLikesHandler(
      albumLikesServices,
      albumServices,
    );
    server.route(routes(albumLikesHandler));
  },
};
