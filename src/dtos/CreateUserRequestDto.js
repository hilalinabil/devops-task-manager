class CreateUserRequestDto {
  constructor({ username, email, password }) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

module.exports = CreateUserRequestDto;
