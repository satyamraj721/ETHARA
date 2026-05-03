const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/role');
const { validateProject, validateMember, handleValidationErrors } = require('../middleware/validation');

router.post('/', authenticateToken, authorizeRole(['ADMIN']), validateProject, handleValidationErrors, projectController.createProject);
router.get('/', authenticateToken, projectController.getProjects);
router.post('/:id/members', authenticateToken, validateMember, handleValidationErrors, projectController.addMember);

module.exports = router;