const views = require('../../views');

module.exports.read = async (params, meta) => {
  return views.render('./src/views/inscription/debut.ejs', {
    user: meta.user
  });
};
