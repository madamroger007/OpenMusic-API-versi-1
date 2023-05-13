const autoBind = require('auto-bind');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikeHandler {
  constructor(albumLikeService, albumService) {
    this.AlbumLike = albumLikeService;
    this.AlbumService = albumService;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.AlbumService.getAlbumById(id);

    const Liked = await this.AlbumLike.checkAlbumtrueLike(
      credentialId,
      id,
    );
    console.log(`Liked 1 ${Liked}`);
    if (!Liked) {
      const test1 = await this.AlbumLike.addAlbumLike(credentialId, id);

      const response = h.response({
        status: 'success',
        message: `Berhasil melakukan like id:${test1}`,
        data: {
          test1,
        },
      });
      console.log(test1);
      response.code(201);
      return response;
    }
    throw new InvariantError('unlike album');
  }

  async deleteLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.AlbumService.getAlbumById(id);
    const Liked = await this.AlbumLike.checkAlbumtrueLike(
      credentialId,
      id,
    );
    console.log(`ini like ${Liked}`);

    if (!Liked) {
      throw new InvariantError('unlike album gagl');
    }

    const test2 = await this.AlbumLike.deleteAlbumLike(
      credentialId,
      id,
    );
    const response = h.response({
      status: 'success',
      message: 'Unlike berhasil dihapus',
    });
    console.log(test2);
    response.code(200);
    return response;
  }

  async getLikeHandler(request, h) {
    const { id } = request.params;
    await this.AlbumService.checkAlbumExist(id);
    const { likes, isCache } = await this.AlbumLike.getAlbumLikeId(id);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    console.log(likes);
    // response.code(200);
    if (isCache) { response.header('X-Data-Source', 'cache'); }
    return response;
  }
}
module.exports = AlbumLikeHandler;
