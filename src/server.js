/* eslint-disable new-cap */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
// albums
const albums = require('./api/albums');
const albumService = require('./services/postgres/albumService');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const songsService = require('./services/postgres/songService');
const SongsValidator = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const albumServices = new albumService();
  const songServices = new songsService();
  const UserServices = new UsersService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{
    plugin: albums,
    options: {
      service: albumServices,
      songServices,
      validator: AlbumsValidator,
    },
  },
  {
    plugin: songs,
    options: {
      service: songServices,
      validator: SongsValidator,
    },
  }, {
    plugin: users,
    options: {
      service: UserServices,
      validator: UsersValidator,
    },
  },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
