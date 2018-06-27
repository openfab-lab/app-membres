const views = require('../../views');

module.exports.read = async (params, meta) => {
  return views.render('./src/views/inscription/etape3.ejs', {
    user: meta.user
  });
};
