#!/usr/bin/env node
'use strict';
const meow = require('meow');
const models = require('../src/models');
const hashPassword = require("../src/helpers/hashPassword");
const shortid = require("shortid");


const cli = meow(`
    Usage
      $ reset-password <passportId>
 
    Examples
      $ reset-password 2569
`);

if (!cli.input[0]) {
    throw new Error('passportId must be supplied')
}

const resetUserPass = async () => {

    // noinspection JSUnresolvedVariable
    const user = await models.users.findOne({
        where: {passportId: cli.input[0]},
        attributes: {exclude: ['password', 'imageRightsConsent']},
    })

    if (!user) {
        throw new Error('User not found')
    }

    // not fort knox
    const newPassword = shortid.generate()
    const hashedNewPassword = await hashPassword.encrypt(newPassword)

    try {
        // noinspection JSUnresolvedVariable
        await models.users.update(
            {
                password: hashedNewPassword
            }, {
                where: {
                    passportId: cli.input[0]
                },
            })

        console.log(`
                
************************
User passportId ${cli.input[0]} got its password set to ${newPassword}
************************`)
    } catch (e) {
        console.error(e)
        throw new Error('Error updating user password');
    }
}

resetUserPass().then(() => process.exit())
