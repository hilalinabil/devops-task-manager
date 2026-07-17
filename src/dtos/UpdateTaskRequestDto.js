class UpdateTaskRequestDto {
  constructor({ title, description, status }, taskId, userId) {
    this.id = taskId;
    this.title = title;
    this.description = description || '';
    this.status = status;
    this.userId = userId;
  }
}

module.exports = UpdateTaskRequestDto;
