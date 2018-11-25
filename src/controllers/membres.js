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
        passportId: params.id
      },
      attributes: { exclude: ['password'] }
    });

    if (!member) {
      return 404;
    }

    member.hashedEmail = hashEmail.hashMd5(member.email);
    const privacyLevel = meta.user ? [models.projects.privacyLevels.MEMBERS, models.projects.privacyLevels.PUBLIC] : models.projects.privacyLevels.PUBLIC;

    const projects = await member.getProjects({
      where: {
        privacyLevel: privacyLevel
      },
      include: [{
        model: models.users,
        as: 'users'
      }]
    });

    return views.render('./src/views/membre.ejs', {
      user: meta.user,
      projects: projects,
      member: member
    });
  }

  const membres = await models.users.findAll({
    order: sequelize.random(),
    attributes: { exclude: ['password'] },
    raw: true
  });

  membres.forEach(function (user, index) {
    membres[index].hashedEmail = hashEmail.hashMd5(user.email);
  });

  return views.render('./src/views/membres.ejs', {
    user: meta.user,
    membres
  });
};
