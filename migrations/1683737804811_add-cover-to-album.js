/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    coverUrl: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', '"coverUrl"');
};
