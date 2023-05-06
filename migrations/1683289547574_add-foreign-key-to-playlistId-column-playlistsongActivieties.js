/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'playlists_song_activities',
    'fk_playlists_song_activities.playlist_id_playlists.id',
    'FOREIGN KEY ("playlist_id") REFERENCES playlists(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'playlists_song_activities',
    'fk_playlists_song_activities.playlist_id_playlists.id',
  );
};
