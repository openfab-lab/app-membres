/*
This file holds custom validators for validate.js
 */

const models = require('../../models');

const validate = require('validate.js');

/**
 * Check if a database record exists with : entityName.attribute = value
 * @param  {string} entityName Table name
 * @param  {string} attribute Column name
 * @return {?string}          message or undefined
 */
module.exports.uniqueInTableValidator = (entityName, attribute) => (value, attributes, attributeName, options, constraints) => {
  return new validate.Promise(function (resolve, reject) {

    models[entityName].find({
      here: {
        [attribute]: value
      }
    })
      .then((response) => {
        resolve(response !== null ? attributes.message : undefined);
      })
      .catch((e) => {
        console.error(e);
        resolve(options.message);
      });
  });
};
