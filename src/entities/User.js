class User {
  constructor({ id, username, email, password_hash, created_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = password_hash;
    this.createdAt = created_at;
  }
}

module.exports = User;
