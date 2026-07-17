const express = require('express');
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

// Register routing sub-modules
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
