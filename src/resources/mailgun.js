const config = require('config');
const mailgun = require('mailgun-js')({
  apiKey: config.email.apiKey,
  domain: config.email.domain,
  host: config.email.host
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
