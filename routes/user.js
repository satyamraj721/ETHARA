const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/role');

router.get('/', authenticateToken, userController.getUsers);
router.post('/', authenticateToken, authorizeRole(['ADMIN']), userController.createUser);

module.exports = router;
