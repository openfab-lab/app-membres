const views = require('../../views');

module.exports.read = async (params, meta) => {
  return views.render('./src/views/perso/profil.ejs', {
    user: meta.user
  });
};
