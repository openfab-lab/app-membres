const bcrypt = require('bcrypt-nodejs');

module.exports.encrypt = password =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        return reject(saltErr);
      }

      bcrypt.hash(password, salt, null, (hashErr, hashString) => {
        if (hashErr) {
          return reject(hashErr);
        }
        resolve(hashString);
      });
    });
  });

module.exports.compare = (raw, encrypted) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(raw, encrypted, (err, match) => {
      if (err) {
        return reject(err);
      }
      resolve(match);
    });
  });
