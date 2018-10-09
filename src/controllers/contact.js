const config = require('config');
const mailgun = require('mailgun-js')({
  apiKey: config.email.apiKey,
  domain: config.email.domain
});

const views = require('../views');

const view = './src/views/contact.ejs';

module.exports.read = async (params, meta) => {
  return views.render(view, {
    user: meta.user,
    id: params.id,
    errorMessage: null,
    successMessage: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  return new Promise((resolve, reject) => {
    const data = {
      from: `${params.name} <${params.email}>`,
      to: config.email.to,
      subject: 'Message sur le site web d\'Openfab',
      text: params.message
    };

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
      }

      resolve(views.render(view, {
        user: meta.user,
        id: params.id,
        errorMessage: null,
        successMessage: true
      }));
    });
  });
};
