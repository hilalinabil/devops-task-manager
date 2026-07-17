const taskRepository = require('../repositories/taskRepository');
const TaskResponseDto = require('../dtos/TaskResponseDto');
const NotFoundError = require('../exceptions/NotFoundError');

class TaskService {
  /**
   * Get all tasks of a user with optional filter
   * @param {number} userId 
   * @param {string} [status] - Optional status filter
   * @returns {Promise<TaskResponseDto[]>}
   */
  async getAllTasks(userId, status) {
    const tasks = await taskRepository.findAll(userId, status);
    return tasks.map(task => TaskResponseDto.fromEntity(task));
  }

  /**
   * Get a task by ID, verifying ownership
   * @param {number} id 
   * @param {number} userId 
   * @returns {Promise<TaskResponseDto>}
   */
  async getTaskById(id, userId) {
    const task = await taskRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }
    return TaskResponseDto.fromEntity(task);
  }

  /**
   * Create a new task
   * @param {CreateTaskRequestDto} createTaskDto 
   * @returns {Promise<TaskResponseDto>}
   */
  async createTask(createTaskDto) {
    const { title, description, status, userId } = createTaskDto;
    const newTask = await taskRepository.create(title, description, status, userId);
    return TaskResponseDto.fromEntity(newTask);
  }

  /**
   * Update an existing task
   * @param {UpdateTaskRequestDto} updateTaskDto 
   * @returns {Promise<TaskResponseDto>}
   */
  async updateTask(updateTaskDto) {
    const { id, title, description, status, userId } = updateTaskDto;
    
    // Check if the task exists and belongs to the user
    const existingTask = await taskRepository.findById(id, userId);
    if (!existingTask) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    const updatedTask = await taskRepository.update(id, title, description, status, userId);
    return TaskResponseDto.fromEntity(updatedTask);
  }

  /**
   * Delete a task
   * @param {number} id 
   * @param {number} userId 
   * @returns {Promise<boolean>}
   */
  async deleteTask(id, userId) {
    // Check if the task exists and belongs to the user
    const existingTask = await taskRepository.findById(id, userId);
    if (!existingTask) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }

    return await taskRepository.delete(id, userId);
  }
}

module.exports = new TaskService();
