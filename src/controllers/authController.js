const authService = require('../services/authService');
const CreateUserRequestDto = require('../dtos/CreateUserRequestDto');
const LoginRequestDto = require('../dtos/LoginRequestDto');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res, next) {
    try {
      const createUserDto = new CreateUserRequestDto(req.body);
      const userResponse = await authService.register(createUserDto);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: userResponse
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in user and return JWT token
   */
  async login(req, res, next) {
    try {
      const loginDto = new LoginRequestDto(req.body);
      const { token, user } = await authService.login(loginDto);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log out user (clearing client state)
   */
  async logout(req, res, next) {
    try {
      // In JWT architectures logout is typically managed client-side by discarding the token,
      // but we provide a standard successful message response to allow endpoints compliance.
      return res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
