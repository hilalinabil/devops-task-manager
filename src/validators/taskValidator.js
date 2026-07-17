const { body, param } = require('express-validator');
const validate = require('./validate');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .trim()
    .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),
  validate
];

const updateTaskValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),
  validate
];

const taskIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
  validate
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator
};
