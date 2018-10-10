const config = require('config');
const rp = require('request-promise');

module.exports.validateVAT = (vat) => {
  const requestUrl = `http://www.apilayer.net/api/validate` +
    `?access_key=${config.vatlayer.key}&vat_number=${vat}`;

  return rp(requestUrl)
    .then(result => {
      return JSON.parse(result).valid === true;
    })
    .catch(err => {
      throw err;
    });
};
