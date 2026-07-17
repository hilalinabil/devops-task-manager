const healthService = require('../services/healthService');

class HealthController {
  /**
   * Health Check Handler (GET /health)
   */
  checkHealth(req, res, next) {
    try {
      const health = healthService.getHealthStatus();
      return res.status(200).json(health);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Readiness Check Handler (GET /ready)
   */
  async checkReadiness(req, res, next) {
    try {
      const readiness = await healthService.getReadinessStatus();
      
      if (readiness.database === 'UP') {
        return res.status(200).json(readiness);
      } else {
        return res.status(503).json(readiness);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HealthController();
