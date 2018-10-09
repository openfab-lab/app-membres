const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const shortid = require('shortid');

const setClassMethods = Bills => {
  Bills.findByIds = attachFindByIds(Bills);

  Bills.deleteByIds = attachDeleteByIds(Bills);

  Bills.deleteCascade = async (ids, models) => {
    return Bills.deleteByIds(ids);
  };

  Bills.updateByIds = attachUpdateByIds(Bills);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Bills = sequelize.define('bills', {

    shortid: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'bills_short_id'
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'last_balance'
    },

    date: {
      type: DataTypes.DATE
    },

    url: {
      type: DataTypes.TEXT
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

  setClassMethods(Bills);

  return Bills;
};
