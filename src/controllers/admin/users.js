const models = require('../../models');
const views = require('../../views');
const log = require('saga-logger').create({ module: module.id });

module.exports.read = async (params, meta) => {
  log.debug('VIEW_ADMIN_USERS_ROUTE_READ_START', null, params);

  const users = await models.users.findAll({
    raw: true
  });

  return views.render('./src/views/admin/users.ejs', {
    user: meta.user,
    users
  });
};
