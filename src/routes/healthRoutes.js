const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

// Define health check and readiness routes
router.get('/health', healthController.checkHealth);
router.get('/ready', healthController.checkReadiness);

module.exports = router;
