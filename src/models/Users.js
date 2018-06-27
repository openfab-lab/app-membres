const {
  attachDeleteByIds,
  attachFindByIds,
  attachUpdateByIds
} = require('../helpers/models');

const setClassMethods = Users => {
  Users.findByIds = attachFindByIds(Users);

  Users.deleteByIds = attachDeleteByIds(Users);

  Users.deleteCascade = async (ids, models) => {
    // await models.awards.deleteByUserIds(ids); //TODO
    return Users.deleteByIds(ids);
  };

  Users.updateByIds = attachUpdateByIds(Users);
};

module.exports = (sequelize, DataTypes) => { // NOSONAR
  const Users = sequelize.define('users', {

    username: {
      type: DataTypes.TEXT,
      allowNull: false
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

    language: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    permissionsLevel: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'permissions_level'
    },

    registerValidate: {
      type: DataTypes.BOOLEAN,
      field: 'register_validate'
    },

    level: {
      type: DataTypes.INTEGER,
      field: 'level'
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
    indexes: [
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
      },
      {
        name: 'user_username',
        unique: true,
        fields: ['username'],
        where: {
          deleted_at: null
        }
      },
      {
        name: 'user_username_deletedAt',
        unique: true,
        fields: ['username', 'deleted_at'],
        where: {
          deleted_at: {
            $ne: null
          }
        }
      }
    ]
  }
  );

  setClassMethods(Users);

  return Users;
};
