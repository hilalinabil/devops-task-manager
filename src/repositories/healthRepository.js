const { pool } = require('../config/database');

class HealthRepository {
  /**
   * Ping database with a lightweight check query
   * @returns {Promise<boolean>} True if database responds, false otherwise
   */
  async pingDatabase() {
    try {
      // Execute simple query to test connection
      await pool.execute('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database connection ping failed:', error.message);
      return false;
    }
  }
}

module.exports = new HealthRepository();
