const healthRepository = require('../repositories/healthRepository');

class HealthService {
  /**
   * Get basic application process status
   * @returns {object} Health details object
   */
  getHealthStatus() {
    return {
      status: 'UP',
      service: 'task-manager-api',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check database connectivity readiness status
   * @returns {Promise<object>} Readiness details object
   */
  async getReadinessStatus() {
    const isDbHealthy = await healthRepository.pingDatabase();
    
    return {
      application: 'UP',
      database: isDbHealthy ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new HealthService();
