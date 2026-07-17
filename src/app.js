const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/env');
const routes = require('./routes');
const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./exceptions/NotFoundError');

const app = express();

// 1. Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "blob:"]
    }
  }
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (config.cors.allowedOrigins.indexOf(origin) !== -1 || config.cors.allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

// 2. Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Health & Readiness Checks
app.use('/', healthRoutes);

// 4. API Routes
app.use('/api', routes);

// 5. Fallback for undefined API routes
app.all('/api/*', (req, res, next) => {
  next(new NotFoundError(`API Route ${req.method} ${req.originalUrl} not found`));
});

// 6. Redirect any unhandled non-API paths to the home directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 7. Global Exception Handler Middleware
app.use(errorHandler);

module.exports = app;
