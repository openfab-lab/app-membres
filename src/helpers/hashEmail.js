var crypto = require('crypto');

module.exports.hash = (email, salt) => {
  var sum = crypto.createHash('sha256');
  sum.update(email + salt);
  return `sha256$${sum.digest('hex')}`;
};

module.exports.hashMd5 = (email) => {
  var sum = crypto.createHash('md5');
  sum.update(email);
  return sum.digest('hex');
};
