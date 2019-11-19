const config = require('config');
const mailgun = require('mailgun-js')({
  apiKey: config.email.apiKey,
  domain: config.email.domain,
  host: config.email.host,
  host: 'api.eu.mailgun.net'
});

module.exports.sendMessage = (message) => {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(message, (error, body) => {
      if (error) {
        reject(error);
      }

      resolve(body);
    });
  });
};
