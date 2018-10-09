const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const shortid = require('shortid');

const setClassMethods = Transactions => {
  Transactions.findByIds = attachFindByIds(Transactions);

  Transactions.deleteByIds = attachDeleteByIds(Transactions);

  Transactions.deleteCascade = async (ids, models) => {
    return Transactions.deleteByIds(ids);
  };

  Transactions.updateByIds = attachUpdateByIds(Transactions);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Transactions = sequelize.define('transactions', {

    shortid: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'transactions_short_id'
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

  setClassMethods(Transactions);

  return Transactions;
};
