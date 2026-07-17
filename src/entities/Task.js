class Task {
  constructor({ id, user_id, title, description, status, created_at, updated_at }) {
    this.id = id;
    this.userId = user_id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

module.exports = Task;
