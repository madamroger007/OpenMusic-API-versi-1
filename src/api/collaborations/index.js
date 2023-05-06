const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { CollaborationsServices, PlaylistsServices, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(CollaborationsServices, PlaylistsServices, validator);
    server.route(routes(collaborationsHandler));
  },
};
