const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const shortid = require('shortid');

const setClassMethods = Billingdetails => {
  Billingdetails.findByIds = attachFindByIds(Billingdetails);

  Billingdetails.deleteByIds = attachDeleteByIds(Billingdetails);

  Billingdetails.deleteCascade = async (ids, models) => {
    return Billingdetails.deleteByIds(ids);
  };

  Billingdetails.updateByIds = attachUpdateByIds(Billingdetails);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Billingdetails = sequelize.define('billingdetails', {

    shortId: {
      type: DataTypes.TEXT,
      unique: 'billingdetails_short_id'
    },

    company: {
      type: DataTypes.TEXT
    },

    inTheNameOf: {
      type: DataTypes.TEXT,
      field: 'in_the_name_of'
    },

    vat: {
      type: DataTypes.TEXT
    },

    address1: {
      type: DataTypes.TEXT
    },

    address2: {
      type: DataTypes.TEXT
    },

    postcode: {
      type: DataTypes.TEXT
    },

    city: {
      type: DataTypes.TEXT
    },

    country: {
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

  setClassMethods(Billingdetails);

  return Billingdetails;
};
