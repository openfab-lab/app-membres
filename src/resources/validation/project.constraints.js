/*
This file holds the validation constraints applied on a project creation form
 */

const validators = require('./validators');
const validate = require('validate.js');

validate.validators.asyncUniqueSlugValidator = validators.uniqueInTableValidator('projects', 'slug');

module.exports.projectConstraints = context => () => ({

  title: {
    presence: {
      message: 'Le titre doit être spécifié'
    }
  },
  description: {

  },
  // No constraints on edition
  slug: context && context === 'edit' ? {} : {
    presence: {
      message: 'Le slug doit être spécifié'
    },
    asyncUniqueSlugValidator: {
      message: 'Cette adresse est déjà occupée...'
    },
    format: {
      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      message: 'Le slug doit respecter ce format : je-suis-un-slug'
    }
  },
  long_description: {

  },
  imageLink: {

  },
  link: {

  },
  privacy_level: {
    presence: {
      message: 'Le niveau de confidentialité doit être spécifié'
    }
  }
});
