const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class CoverAlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addCoverAlbum(id, imagePath) {
    const query = {
      text: 'UPDATE albums SET "coverURL" = $1 WHERE id = $2 RETURNING id',
      values: [imagePath, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}
module.exports = CoverAlbumService;
