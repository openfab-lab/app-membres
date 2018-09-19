const views = require('../../views');
const models = require('../../models');

module.exports.read = async (params, meta) => {
  return views.render('./src/views/inscription/etape4.ejs', {
    user: meta.user,
    id: params.id,
    errorMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  const houseRules = req.body.house_rules === 'on';

  return models.users.update(
    {
      houseRules: houseRules
    }, {
      where: {
        shortId: params.id
      }
    }
  ).then(result => {
    return {
      redirect: '/inscription/confirmation?id=' + params.id
    };
  }).catch(error => {
    console.log(error);
    return views.render('./src/views/inscription/etape4.ejs', {
      id: params.id,
      user: meta.user,
      errorMessage: error.message
    });
  });
};
