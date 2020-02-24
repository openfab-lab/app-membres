const config = require('config');
const mailgun = require('../resources/mailgun');

const svgCaptcha = require('svg-captcha');

const views = require('../views');

const view = './src/views/contact.ejs';

module.exports.read = async (params, meta, req) => {
  const captcha = svgCaptcha.create();
  req.session.captcha = captcha.text

  return views.render(view, {
    user: meta.user,
    id: params.id,
    errorMessage: null,
    successMessage: null,
    captcha:captcha.data
  });
};

module.exports.create = async (params, meta, req, res) => {

  if(!params.captcha || req.session.captcha !== params.captcha) {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text

    return views.render(view, {
      user: meta.user,
      id: params.id,
      errorMessage: 'Wrong captcha',
      successMessage: null,
      captcha:captcha.data
    });
  }

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
