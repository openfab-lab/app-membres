const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const shortid = require('shortid');

const setClassMethods = Projects => {
  Projects.findByIds = attachFindByIds(Projects);

  Projects.deleteByIds = attachDeleteByIds(Projects);

  Projects.deleteCascade = async (ids, models) => {
    return Projects.deleteByIds(ids);
  };

  Projects.updateByIds = attachUpdateByIds(Projects);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Projects = sequelize.define('projects', {

    shortId: {
      type: DataTypes.TEXT,
      unique: 'projects_short_id'
    },

    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    // Project URL key
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },

    imageLink: {
      type: DataTypes.STRING,
      field: 'image_link'
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    // Store Quill Delta object
    longDescription: {
      type: DataTypes.TEXT,
      field: 'long_description'
    },

    // Hold id[] of machines used in project.
    // WARN: Not Database-agnostic
    machines: {
      type: DataTypes.ARRAY(DataTypes.SMALLINT)
    },

    link: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    // Wether or not the project can be visible publicly
    privacyLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'privacy_level'
    },

    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },

    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },

    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate (result, options) {
        result.shortId = shortid.generate();
      }
    },
    indexes: [{
      unique: true,
      fields: ['slug']
    }]
  });

  setClassMethods(Projects);

  Projects.privacyLevels = {
    PRIVATE: 'private',
    MEMBERS: 'members',
    PUBLIC: 'public'
  };

  Projects.associate = models => {
    Projects.belongsToMany(models.users, {
      through: 'user_projects',
      as: 'users',
      foreignKey: 'projectId'
    });
  };

  return Projects;
};
