const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, songServices, validator }) => {
    const albumsHandler = new AlbumsHandler(service, songServices, validator);
    server.route(routes(albumsHandler));
  },
};
