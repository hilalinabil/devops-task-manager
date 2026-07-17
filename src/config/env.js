const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file if it exists
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST, 
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'devops_tm',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_development_only_secret_key_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS 
      ? process.env.CORS_ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000'],
  }
};

// Simple configuration validation
if (config.nodeEnv === 'production' && config.jwt.secret === 'fallback_development_only_secret_key_change_me') {
  console.warn('WARNING: Running in production but using the default development JWT secret key!');
}

module.exports = config;
