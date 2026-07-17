const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400); // 400 Bad Request matches standard client-side mapping for request validation
    this.errors = errors;
  }
}

module.exports = ValidationError;
