/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    coverURL: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', '"coverURL"');
};
