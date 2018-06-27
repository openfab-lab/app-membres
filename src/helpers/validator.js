const ManagedError = require('saga-managed-error');
const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });

module.exports = (schema, params, errorName = 'INPUT_PARAMETERS') => {
  const schemaValidator = ajv.compile(schema);
  const isValid = schemaValidator(params);

  if (!isValid) {
    throw new ManagedError(
      errorName, 400, schemaValidator.errors
    );
  }
  return true;
};
