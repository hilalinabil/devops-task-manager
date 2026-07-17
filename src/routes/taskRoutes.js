const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createTaskValidator, updateTaskValidator, taskIdValidator } = require('../validators/taskValidator');

const router = express.Router();

// Apply authentication middleware to all task management endpoints
router.use(authMiddleware);

// Task CRUD Endpoints
router.post('/', createTaskValidator, taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskIdValidator, taskController.getTaskById);
router.put('/:id', updateTaskValidator, taskController.updateTask);
router.delete('/:id', taskIdValidator, taskController.deleteTask);

module.exports = router;
