const autoBind = require('auto-bind');

class CoverHandler {
  constructor(StorageService, CoverAlbumServices, validator) {
    this._service = StorageService;
    this._cover = CoverAlbumServices;
    this._validator = validator;

    autoBind(this);
  }

  async postCoverImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const coverURL = await this._cover.addCoverAlbum(id, `http://${process.env.HOST}:${process.env.PORT}/albums/covers/file/images/${filename}`);
    const response = h.response({
      status: 'success',
      message: 'cover berhasil diunggah',
      data: {
        coverURL,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CoverHandler;
