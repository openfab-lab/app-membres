const views = require('../../views');

module.exports.read = async (params, meta) => {
  return views.render('./src/views/inscription/etape1.ejs', {
    user: meta.user
  });
};
