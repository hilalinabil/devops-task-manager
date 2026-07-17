class UserResponseDto {
  constructor({ id, username, email, createdAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.createdAt = createdAt;
  }

  /**
   * Map User entity to UserResponseDto
   * @param {object} userEntity - User database entity
   * @returns {UserResponseDto}
   */
  static fromEntity(userEntity) {
    return new UserResponseDto({
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
      createdAt: userEntity.createdAt
    });
  }
}

module.exports = UserResponseDto;
