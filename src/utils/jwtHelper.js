const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate a JWT token for a user
 * @param {object} payload - The token payload (e.g., { id, email })
 * @returns {string} Signed JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * Verify a JWT token
 * @param {string} token - The signed JWT token
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateToken,
  verifyToken
};
