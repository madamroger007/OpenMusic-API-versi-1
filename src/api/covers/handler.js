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
    const filelocation = `http://${process.env.HOST}:${process.env.PORT}/covers/images/${filename}`;
    const coverURL = await this._cover.addCoverAlbum(id, filelocation);
    
    const response = h.response({
      status: 'success',
      message: 'cover berhasil diunggah',
      data: {
        coverURL,
      },
    });
    
    response.code(201);
    console.log(coverURL);
    return response;
  }
}

module.exports = CoverHandler;
