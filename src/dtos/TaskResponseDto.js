class TaskResponseDto {
  constructor({ id, title, description, status, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Map Task entity to TaskResponseDto
   * @param {object} taskEntity - Task database entity
   * @returns {TaskResponseDto}
   */
  static fromEntity(taskEntity) {
    return new TaskResponseDto({
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      status: taskEntity.status,
      createdAt: taskEntity.createdAt,
      updatedAt: taskEntity.updatedAt
    });
  }
}

module.exports = TaskResponseDto;
