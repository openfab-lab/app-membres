const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const shortid = require('shortid');

const setClassMethods = Subscribtions => {
  Subscribtions.findByIds = attachFindByIds(Subscribtions);

  Subscribtions.deleteByIds = attachDeleteByIds(Subscribtions);

  Subscribtions.deleteCascade = async (ids, models) => {
    return Subscribtions.deleteByIds(ids);
  };

  Subscribtions.updateByIds = attachUpdateByIds(Subscribtions);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Subscribtions = sequelize.define('subscribtions', {

    shortid: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'subscribtions_short_id'
    },

    type: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'last_balance'
    },

    validFrom: {
      type: DataTypes.DATE,
      field: 'created_at'
    },

    validUntill: {
      type: DataTypes.DATE,
      field: 'created_at'
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

  setClassMethods(Subscribtions);

  return Subscribtions;
};
