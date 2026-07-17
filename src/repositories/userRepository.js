const { pool } = require('../config/database');
const User = require('../entities/User');

class UserRepository {
  /**
   * Find user by email address
   * @param {string} email 
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /**
   * Find user by username
   * @param {string} username 
   * @returns {Promise<User|null>}
   */
  async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /**
   * Find user by ID
   * @param {number} id 
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /**
   * Create a new user record
   * @param {string} username 
   * @param {string} email 
   * @param {string} passwordHash 
   * @returns {Promise<User>} The created user entity
   */
  async create(username, email, passwordHash) {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    
    return new User({
      id: result.insertId,
      username,
      email,
      password_hash: passwordHash,
      created_at: new Date()
    });
  }
}

module.exports = new UserRepository();
