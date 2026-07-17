class CreateTaskRequestDto {
  constructor({ title, description, status }, userId) {
    this.title = title;
    this.description = description || '';
    this.status = status || 'TODO';
    this.userId = userId;
  }
}

module.exports = CreateTaskRequestDto;
