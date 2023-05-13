const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) returning id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal melakukan Like');
    }
    await this._cacheService.delete(`user_album_likes:${albumId}`);
    return result.rows[0].id;
  }

  async getAlbumLikeId(id) {
    try {
      const file = await this._cacheService.get(`user_album_likes:${id}`);
      return {
        likes: JSON.parse(file),
        isCache: 1,
      };
    } catch (error) {
      const query = {
        text: `SELECT * FROM user_album_likes
        WHERE album_id = $1`,
        values: [id],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(
        `user_album_likes:${id}`,
        JSON.stringify(result.rowCount),
      );

      return { likes: result.rowCount };
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`user_album_likes:${albumId}`, JSON.stringify(result.rowCount));
  }

  async checkAlbumtrueLike(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }
}
module.exports = AlbumLikeService;
