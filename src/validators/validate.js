const { validationResult } = require('express-validator');
const ValidationError = require('../exceptions/ValidationError');

/**
 * Middleware to check express-validator results and raise ValidationError if they exist
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    throw new ValidationError('Validation failed', formattedErrors);
  }
  next();
};

module.exports = validate;
