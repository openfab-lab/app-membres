'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('users', 'imageRightsConsent', {
            type: Sequelize.DataTypes.BOOLEAN,
            field: 'image_rights_consent'
        })
    },

    down: (queryInterface, Sequelize) => {
          return queryInterface.removeColumn('users', 'imageRightsConsent');
    }
};
