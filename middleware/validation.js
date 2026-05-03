const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  handleValidationErrors,
  validateSignup: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['ADMIN', 'MEMBER']).withMessage('Role must be ADMIN or MEMBER'),
  ],
  validateLogin: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateProject: [
    body('name').notEmpty().withMessage('Project name is required'),
  ],
  validateTask: [
    body('title').notEmpty().withMessage('Task title is required'),
    body('projectId').isInt().withMessage('Valid project ID is required'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be TODO, IN_PROGRESS, or DONE'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
    body('dueDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Due date must be a valid ISO date'),
    body('assignedTo').optional({ nullable: true, checkFalsy: true }).isUUID().withMessage('Assigned user ID must be a valid UUID'),
  ],
  validateAssignTask: [
    body('assignedTo').isUUID().withMessage('Valid user ID is required'),
  ],
  validateMember: [
    body('userEmail').optional().isEmail().withMessage('Valid email is required'),
    body('userId').optional().isUUID().withMessage('Valid user ID is required'),
    body('userId', 'userEmail').custom((value, { req }) => {
      if (!req.body.userId && !req.body.userEmail) {
        throw new Error('User ID or email is required');
      }
      return true;
    }),
    body('role').optional().isIn(['ADMIN', 'MEMBER']).withMessage('Role must be ADMIN or MEMBER'),
  ],

  validateProjectIdParam: [
    param('projectId').isInt().withMessage('Valid project ID is required'),
  ],
  validateTaskIdParam: [
    param('id').isInt().withMessage('Valid task ID is required'),
  ],
  validateTaskStatus: [
    body('status').isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status value'),
  ],
};
