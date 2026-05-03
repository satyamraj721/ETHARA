const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/role');
const {
  validateTask,
  validateAssignTask,
  validateTaskStatus,
  validateTaskIdParam,
  validateProjectIdParam,
  handleValidationErrors,
} = require('../middleware/validation');

router.post('/', authenticateToken, validateTask, handleValidationErrors, taskController.createTask);
router.put(
  '/:id/assign',
  authenticateToken,
  validateTaskIdParam,
  validateAssignTask,
  handleValidationErrors,
  taskController.assignTask
);
router.put(
  '/:id/status',
  authenticateToken,
  validateTaskIdParam,
  validateTaskStatus,
  handleValidationErrors,
  taskController.updateTaskStatus
);
router.get('/project/:projectId', authenticateToken, validateProjectIdParam, handleValidationErrors, taskController.getTasksByProject);

module.exports = router;
