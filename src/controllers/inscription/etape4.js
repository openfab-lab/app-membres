const config = require('config');
const mailgun = require('mailgun-js')({
  apiKey: config.email.apiKey,
  domain: config.email.domain
});

const views = require('../../views');
const models = require('../../models');

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
    const data = {
      from: config.email.from,
      to: result[1][0].email,
      subject: 'Hello',
      text: 'Bienvenue chez nous!'
    };

    return new Promise((resolve, reject) => {
      mailgun.messages().send(data, (error, body) => {
        if (error) {
          reject(error);
        }

        resolve({
          redirect: '/inscription/confirmation?id=' + params.id
        });
      });
    });
  }).catch(error => {
    return views.render(view, {
      id: params.id,
      user: meta.user,
      errorMessage: error.message
    });
  });
};
