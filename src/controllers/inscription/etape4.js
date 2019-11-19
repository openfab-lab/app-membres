const config = require('config');

const views = require('../../views');
const models = require('../../models');
const mailgun = require('../../resources/mailgun');

const log = require('saga-logger').create({ module: module.id });

const view = './src/views/inscription/etape4.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
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
      },
      returning: true,
      raw: true
    }
  ).then(result => {
    const message = {
      from: config.email.from,
      to: result[1][0].email,
      subject: 'Hello',
      text: 'Bienvenue chez nous!'
    };

    return mailgun.sendMessage(message)
      .then(result => {
        return {
          redirect: '/inscription/confirmation?id=' + params.id
        };
      });
  }).catch(error => {
    log.error('ETAPE4_ERROR', error);
    return views.render(view, {
      id: params.id,
      user: meta.user,
      errorMessage: error.message
    });
  });
};
