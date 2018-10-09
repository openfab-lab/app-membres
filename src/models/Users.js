const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const shortid = require('shortid');

const setClassMethods = Users => {
  Users.findByIds = attachFindByIds(Users);

  Users.deleteByIds = attachDeleteByIds(Users);

  Users.deleteCascade = async (ids, models) => {
    return Users.deleteByIds(ids);
  };

  Users.updateByIds = attachUpdateByIds(Users);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Users = sequelize.define('users', {

    shortId: {
      type: DataTypes.TEXT
    },

    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'first_name'
    },

    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'last_name'
    },

    phoneNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'phone_number'
    },

    language: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    github: {
      type: DataTypes.TEXT
    },

    stripeAccount: {
      type: DataTypes.TEXT
    },

    bio: {
      type: DataTypes.TEXT
    },

    permissionsLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'permissions_level'
    },

    majority: {
      type: DataTypes.BOOLEAN,
      field: 'majority'
    },

    insurance: {
      type: DataTypes.BOOLEAN,
      field: 'insurance'
    },

    houseRules: {
      type: DataTypes.BOOLEAN,
      field: 'house_rules'
    },

    registerValidate: {
      type: DataTypes.BOOLEAN,
      field: 'register_validate'
    },

    registerValidUntil: {
      type: DataTypes.DATE,
      field: 'register_valid_until'
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
    indexes: [
      {
        name: 'user_register_valid_until',
        unique: false,
        fields: ['register_valid_until']
      },
      {
        name: 'user_email',
        unique: true,
        fields: ['email'],
        where: {
          deleted_at: null
        }
      },
      {
        name: 'user_email_deletedAt',
        unique: true,
        fields: ['email', 'deleted_at'],
        where: {
          deleted_at: {
            $ne: null
          }
        }
      }
    ]
  });

  setClassMethods(Users);

  Users.associate = models => {
    Users.hasMany(models.projects);
    Users.hasMany(models.bills);
    Users.hasMany(models.subscribtions);
    Users.hasMany(models.billingdetails);
    Users.hasOne(models.wallets);
  };

  return Users;
};
