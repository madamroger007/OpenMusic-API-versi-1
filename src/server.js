require('dotenv').config();

const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const path = require('path');
const Inert = require('@hapi/inert');
const config = require('./utils/config');
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

// authentications
const authentications = require('./api/aunthentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// Playlist Song
const playlistSongs = require('./api/playlistsong');
const PlaylistSongsService = require('./services/postgres/playlistSongService');
const PlaylistSongValidator = require('./validator/playlistsong');

// Playlist Song Activities
const playlistSongActivities = require('./api/playlistsongactivities');
const PlaylistSongActivitiesService = require('./services/postgres/playlistSongActivitiesservice');

// Collaboration
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Upload cover
const cover = require('./api/covers');
const StorageService = require('./services/storage/StorageService');
const CoverValidator = require('./validator/covers');
const CoverAlbumService = require('./services/postgres/coverAlbumService');

//  AlbumLikes
const albumLikes = require('./api/albumsLike');
const AlbumLikeService = require('./services/postgres/albumLikeService');

// cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const albumServices = new albumService();
  const songServices = new songsService();
  const CollaborationsServices = new CollaborationsService();
  const PlaylistsServices = new PlaylistsService(CollaborationsServices);
  const PlaylistSongServices = new PlaylistSongsService(CollaborationsServices);
  const PlaylistSongActivitiesServices = new PlaylistSongActivitiesService();
  const UserServices = new UsersService();
  const CoverAlbumServices = new CoverAlbumService();
  const authenticationsServices = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/covers/file/images'));
  const albumLikesServices = new AlbumLikeService(cacheService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
  {
    plugin: authentications,
    options: {
      authenticationsServices,
      UserServices,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  }, {
    plugin: playlists,
    options: {
      service: PlaylistsServices,
      validator: PlaylistsValidator,
    },
  },
  {
    plugin: playlistSongs,
    options: {
      PlaylistSongActivitiesServices,
      PlaylistSongServices,
      songServices,
      PlaylistsServices,
      validator: PlaylistSongValidator,
    },
  },
  {
    plugin: playlistSongActivities,
    options: {
      PlaylistSongActivitiesServices,
      PlaylistsServices,
    },
  },
  {
    plugin: collaborations,
    options: {
      CollaborationsServices,
      PlaylistsServices,
      validator: CollaborationsValidator,
    },
  },
  {
    plugin: _exports,
    options: {
      PlaylistsServices,
      ProducerService,
      validator: ExportsValidator,
    },
  },
  {
    plugin: cover,
    options: {
      storageService,
      CoverAlbumServices,
      validator: CoverValidator,
    },
  },
  {
    plugin: albumLikes,
    options: {
      albumLikesServices,
      albumServices,
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

      console.log(response);
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
