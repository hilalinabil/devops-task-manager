const taskService = require('../services/taskService');
const CreateTaskRequestDto = require('../dtos/CreateTaskRequestDto');
const UpdateTaskRequestDto = require('../dtos/UpdateTaskRequestDto');

class TaskController {
  /**
   * Create a new task for the authenticated user
   */
  async createTask(req, res, next) {
    try {
      const userId = req.user.id;
      const createTaskDto = new CreateTaskRequestDto(req.body, userId);
      const taskResponse = await taskService.createTask(createTaskDto);

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: taskResponse
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all tasks of the authenticated user (with optional status filter)
   */
  async getAllTasks(req, res, next) {
    try {
      const userId = req.user.id;
      const { status } = req.query;
      const tasks = await taskService.getAllTasks(userId, status);

      return res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific task by ID
   */
  async getTaskById(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId = parseInt(req.params.id, 10);
      const task = await taskService.getTaskById(taskId, userId);

      return res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a specific task
   */
  async updateTask(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId = parseInt(req.params.id, 10);
      const updateTaskDto = new UpdateTaskRequestDto(req.body, taskId, userId);
      const updatedTask = await taskService.updateTask(updateTaskDto);

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a specific task
   */
  async deleteTask(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId = parseInt(req.params.id, 10);
      await taskService.deleteTask(taskId, userId);

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
