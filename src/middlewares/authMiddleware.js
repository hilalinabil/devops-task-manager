const UnauthorizedError = require('../exceptions/UnauthorizedError');
const { verifyToken } = require('../utils/jwtHelper');

/**
 * Authentication middleware that validates JWT token
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Access token is missing');
    }

    try {
      const decoded = verifyToken(token);
      
      // Store user payload on request
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email
      };
      
      next();
    } catch (err) {
      throw new UnauthorizedError('Token is invalid or expired');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
