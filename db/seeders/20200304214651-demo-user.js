'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                shortId: 'johndoe123456789',
                passportId: '123456789',
                email: 'john.doe@mail.mail',
                // test
                password: '$2a$10$a0Kv1BnfKmsNuBD8ojsv8eOx21dG2yJdnXf/pJQl6iQXS2I.UaTjy',
                first_name: 'john',
                last_name: 'doe',
                phone_number: '012234567',
                language: 'FR',
                github: null,
                stripeAccount: null,
                bio: null,
                permissions_level: 1,
                majority: true,
                insurance: false,
                house_rules: true,
                // User grant rights to display their profile pic on the web
                image_rights_consent: false,
                register_validate: true,
                register_valid_until: null
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', {shortId: 'johndoe123456789'}, {});
    }
};
