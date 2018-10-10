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

    shortid: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'projects_short_id'
    },

    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    link: {
      type: DataTypes.TEXT,
      allowNull: false
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
    indexes: []
  });

  setClassMethods(Projects);

  return Projects;
};
