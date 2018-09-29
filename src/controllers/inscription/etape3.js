const views = require('../../views');
const models = require('../../models');

const view = './src/views/inscription/etape3.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
    user: meta.user,
    id: params.id,
    errorMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  const insurance = req.body.insurance === 'on';

  return models.users.update(
    {
      insurance: insurance
    }, {
      where: {
        shortId: params.id
      }
    }
  ).then(result => {
    return {
      redirect: '/inscription/etape4?id=' + params.id
    };
  }).catch(error => {
    return views.render(view, {
      id: params.id,
      user: meta.user,
      errorMessage: error.message
    });
  });
};
