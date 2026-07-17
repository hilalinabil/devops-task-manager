const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const UserResponseDto = require('../dtos/UserResponseDto');
const BadRequestError = require('../exceptions/BadRequestError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');
const jwtHelper = require('../utils/jwtHelper');

class AuthService {
  /**
   * Register a new user
   * @param {CreateUserRequestDto} createUserDto 
   * @returns {Promise<UserResponseDto>} The registered user details
   */
  async register(createUserDto) {
    const { username, email, password } = createUserDto;

    // Check if email already exists
    const existingEmailUser = await userRepository.findByEmail(email);
    if (existingEmailUser) {
      throw new BadRequestError('Email address is already registered');
    }

    // Check if username already exists
    const existingUsernameUser = await userRepository.findByUsername(username);
    if (existingUsernameUser) {
      throw new BadRequestError('Username is already taken');
    }

    // Hash the password with bcrypt (12 rounds)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save to database
    const newUserEntity = await userRepository.create(username, email, passwordHash);

    // Map and return response DTO
    return UserResponseDto.fromEntity(newUserEntity);
  }

  /**
   * Authenticate a user and generate a JWT token
   * @param {LoginRequestDto} loginDto 
   * @returns {Promise<{token: string, user: UserResponseDto}>}
   */
  async login(loginDto) {
    const { email, password } = loginDto;

    // Retrieve user by email
    const userEntity = await userRepository.findByEmail(email);
    if (!userEntity) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, userEntity.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Map user to safe DTO
    const userResponseDto = UserResponseDto.fromEntity(userEntity);

    // Sign JWT token
    const token = jwtHelper.generateToken({
      id: userResponseDto.id,
      username: userResponseDto.username,
      email: userResponseDto.email
    });

    return {
      token,
      user: userResponseDto
    };
  }
}

module.exports = new AuthService();
