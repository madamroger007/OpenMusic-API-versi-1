const coverHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'cover',
  version: '1.0.0',
  register: async (server, { storageService, CoverAlbumServices, validator }) => {
    const coverHandlers = new coverHandler(storageService, CoverAlbumServices, validator);
    server.route(routes(coverHandlers));
  },
};
