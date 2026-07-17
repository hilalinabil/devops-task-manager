const express = require('express');
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();

// Public routes for user onboarding & auth sessions
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
