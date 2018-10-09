const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const shortid = require('shortid');

const setClassMethods = Wallets => {
  Wallets.findByIds = attachFindByIds(Wallets);

  Wallets.deleteByIds = attachDeleteByIds(Wallets);

  Wallets.deleteCascade = async (ids, models) => {
    return Wallets.deleteByIds(ids);
  };

  Wallets.updateByIds = attachUpdateByIds(Wallets);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Wallets = sequelize.define('wallets', {

    shortid: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'wallets_short_id'
    },

    lastBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'last_balance'
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

  setClassMethods(Wallets);

  Wallets.associate = models => {
    Wallets.hasMany(models.transactions);
  };

  return Wallets;
};
