const { pool } = require('../config/database');
const Task = require('../entities/Task');

class TaskRepository {
  /**
   * Find all tasks for a specific user, with optional status filter
   * @param {number} userId 
   * @param {string} [status] - Optional status filter
   * @returns {Promise<Task[]>} Array of Task entities
   */
  async findAll(userId, status) {
    let query = 'SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows.map(row => new Task(row));
  }

  /**
   * Find task by ID and verify user ownership
   * @param {number} id 
   * @param {number} userId 
   * @returns {Promise<Task|null>}
   */
  async findById(id, userId) {
    const [rows] = await pool.execute(
      'SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ? LIMIT 1',
      [id, userId]
    );
    if (rows.length === 0) return null;
    return new Task(rows[0]);
  }

  /**
   * Create a new task
   * @param {string} title 
   * @param {string} description 
   * @param {string} status 
   * @param {number} userId 
   * @returns {Promise<Task>} The created task entity
   */
  async create(title, description, status, userId) {
    const [result] = await pool.execute(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description, status]
    );

    // Retrieve the created task to return fully populated model
    const createdTask = await this.findById(result.insertId, userId);
    return createdTask;
  }

  /**
   * Update an existing task
   * @param {number} id 
   * @param {string} title 
   * @param {string} description 
   * @param {string} status 
   * @param {number} userId 
   * @returns {Promise<Task|null>}
   */
  async update(id, title, description, status, userId) {
    await pool.execute(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description, status, id, userId]
    );
    
    return this.findById(id, userId);
  }

  /**
   * Delete a task
   * @param {number} id 
   * @param {number} userId 
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new TaskRepository();
