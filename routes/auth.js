const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validation');

router.post('/signup', validateSignup, handleValidationErrors, authController.signup);
router.post('/login', validateLogin, handleValidationErrors, authController.login);

module.exports = router;