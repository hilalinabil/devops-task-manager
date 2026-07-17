const AppError = require('../exceptions/AppError');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handling JSON syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload';
  }

  // Under development environment, log detailed system errors to server console
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('Unhandled System Error:', err);
  }

  const response = {
    success: false,
    message: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };

  // If ValidationError contains field-specific errors, add them
  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
