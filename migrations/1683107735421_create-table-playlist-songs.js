/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(50)',
      notNull: false,
    },
    song_id: {
      type: 'varchar(50)',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
