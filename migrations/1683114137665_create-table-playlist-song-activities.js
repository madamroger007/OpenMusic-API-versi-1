/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists_song_activities', {
    id: {
      type: 'varchar(50)',
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    song_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    action: {
      type: 'varchar(50)',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_song_activities');
};
