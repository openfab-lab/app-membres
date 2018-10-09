const views = require('../../views');
const models = require('../../models');

const view = './src/views/inscription/etape1b.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
    user: meta.user,
    returningSubscription: {},
    errorMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  return {
    redirect: '/inscription/etape2?id=' + params.id
  };
};
