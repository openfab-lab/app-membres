const sequelize = require('../resources/postgresql');
const models = require('../models');
const views = require('../views');
const hashEmail = require('../helpers/hashEmail');
const log = require('saga-logger').create({ module: module.id });

module.exports.read = async (params, meta) => {
  log.debug('VIEW_MEMBRES_ROUTE_READ_START', null, params);

  if (params.id) {
    const member = await models.users.find({
      where: {
        shortId: params.id
      },
      attributes: { exclude: ['password'] },
      raw: true
    });

    return views.render('./src/views/membre.ejs', {
      user: meta.user,
      member: member
    });
  }

  const users = await models.users.findAll({
    order: sequelize.random(),
    attributes: { exclude: ['password'] },
    raw: true
  });

  users.forEach(function (user, index) {
    users[index].hashedEmail = hashEmail.hashMd5(user.email);
  });

  return views.render('./src/views/membres.ejs', {
    user: meta.user,
    users
  });
};
