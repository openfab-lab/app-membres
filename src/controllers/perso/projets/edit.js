const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models');
const validate = require('validate.js');

const views = require('../../../views');
const view = './src/views/perso/projects/edit.ejs';

// Form validation constraints
const {
  projectConstraints
} = require('../../../resources/validation/project.constraints');
const editProjectConstraints = projectConstraints('edit');

module.exports.read = async (params, meta) => {
  const project = await models.projects.findOne({
    where: {
      slug: params.id
    }
  });

  if (!project) {
    return 404;
  }

  // Check if logged user belongs to the project
  const users = await project.getUsers();
  if (!users.find(u => u.id === meta.user.id)) {
    return 403;
  }
  // Store information in the object
  project.users = users;

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

    showLabel: true,
    formAction: '.',
    privacyLevels: models.projects.privacyLevels,
    users: allUsers,

    returningNewProject: project,
    errors: null
  });
};

// Using create hook to keep working directly with <form>
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

  // Form validation
  try {
    await validate.async(params, editProjectConstraints);
  } catch (e) {
    return views.render(view, {
      user: meta.user,
      privacyLevels: models.projects.privacyLevels,
      users: allUsers,

      returningNewProject: req.body,
      errors: e
    });
  }

  const project = await models.projects.findOne({
    where: {
      id: req.body.projectId
    }
  });

  if (!project) {
    return 404;
  }

  // Check if logged user belongs to the project
  const users = await project.getUsers();
  if (!users.find(u => u.id === meta.user.id)) {
    return 403;
  }

  return models.projects.update({
    title: req.body.title,
    description: req.body.description,
    // Cannot update slug
    // slug: req.body.slug,
    longDescription: req.body.long_description,
    link: req.body.link,
    privacyLevel: req.body.privacy_level
  }, {
    where: {
      id: project.id
    }
  })
    .then(result => {
      return {
        redirect: `/perso/projets/${project.slug}`
        // TODO: add succes message
      };
    })
    .catch(async error => {
      console.error(error);

      return views.render(view, {
        user: meta.user,
        users: allUsers,
        returningNewProject: req.body,
        errors: error.original.detail,

        showLabel: true,
        formAction: '.',
        privacyLevels: models.projects.privacyLevels
      });
    });
};

module.exports.destroy = async (params, meta, req, res) => {
  const project = await models.projects.findById(params.id);

  if (!project) {
    return 400;
  }

  // Check if logged user belongs to the project
  const users = await project.getUsers();
  if (!users.find(u => u.id === meta.user.id)) {
    return 403;
  }

  models.projects.destroy({
    where: {
      id: project.id
    }
  })
    .then(() => 200)
    .catch((e) => {
      console.error(e);
      return 500;
    });
};
