const config = require('config');
const mailgun = require('../resources/mailgun');

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
  const message = {
    from: `${params.name} <${params.email}>`,
    to: config.email.to,
    subject: 'Message sur le site web d\'Openfab',
    text: params.message
  };

  return mailgun.sendMessage(message)
    .then(result => {
      return views.render(view, {
        user: meta.user,
        id: params.id,
        errorMessage: null,
        successMessage: true
      });
    });
};
