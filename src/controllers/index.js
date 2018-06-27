const views = require('../views');

module.exports.read = async (params, meta) => {
  return views.render('./src/views/index.ejs', {
    user: meta.user
  });
};
