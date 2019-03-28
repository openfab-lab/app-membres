const models = require('../../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validate = require('validate.js');
const views = require('../../../views');
const view = './src/views/perso/projects/new.ejs';

// Form validation constraints
const {
  projectConstraints
} = require('../../../resources/validation/project.constraints');
const projectCreationConstraints = projectConstraints('create');

module.exports.read = async (params, meta) => {
  const allUsers = await models.users.findAll({
    where: {
      id: {
        [Op.ne]: meta.user.id
      }
    },
    attributes: {
      exclude: ['password']
    }
  });

  return views.render(view, {
    user: meta.user,

    privacyLevels: models.projects.privacyLevels,
    users: allUsers,

    returningNewProject: {users: []},
    errors: null
  });
};

module.exports.create = async (params, meta, req, res) => {
  const allUsers = await models.users.findAll({
    where: {
      id: {
        [Op.ne]: meta.user.id
      }
    },
    attributes: {
      exclude: ['password']
    }
  });

  // Validation
  try {
    await validate.async(params, projectCreationConstraints);
  } catch (e) {
    console.error(e);
    return views.render(view, {
      user: meta.user,
      privacyLevels: models.projects.privacyLevels,
      users: allUsers,

      returningNewProject: req.body,
      errors: e
    });
  }

  // Create project
  return models.projects.create({
    title: req.body.title,
    description: req.body.description,
    slug: req.body.slug,
    // No escape on rendering
    longDescription: req.sanitize(req.body.long_description),
    imageLink: req.body.imageLink,
    link: req.body.link,
    privacyLevel: req.body.privacy_level
  })
    .then(async result => {
      // Add users relations
      // Adding logged user id to the choice from form
      const userIds = typeof params.users === 'string' ? [params.users, meta.user.id] : params.users.concat(meta.user.id);
      const users = await models.users.findAll({
        where: {
          id: {
            [Op.in]: userIds.map(id => parseInt(id, 10))
          }
        }
      });

      result.addUsers(users.map(u => u.id));

      return {
        redirect: '/perso/projets'
        // TODO: add succes message
      };
    })
    .catch(error => {
      console.error(error);

      return views.render(view, {
        user: meta.user,
        returningNewProject: req.body,
        users: allUsers,
        privacyLevels: models.projects.privacyLevels,

        errors: 'Erreur'
      });
    });
};
