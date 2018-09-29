const views = require('../../views');
const models = require('../../models');

const view = './src/views/inscription/etape2.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
    id: params.id,
    user: meta.user,
    errorMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  const over18 = req.body.majority === 'over_than_18';

  return models.users.update(
    {
      majority: over18
    }, {
      where: {
        shortId: params.id
      }
    }
  ).then(result => {
    return {
      redirect: '/inscription/etape3?id=' + params.id
    };
  }).catch(error => {
    return views.render(view, {
      id: params.id,
      user: meta.user,
      errorMessage: error.message
    });
  });
};
