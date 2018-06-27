const ejs = require('ejs');

module.exports.render = (view, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(view, data, (err, str) => {
      if (err) {
        reject(err);
      }
      resolve(str);
    });
  });
};
