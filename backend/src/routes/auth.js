const express = require('express');
const authController = require('../controllers/authController');
const validateMiddleware = require('../middleware/validate');
const rateLimitMiddleware = require('../middleware/rateLimit');
const router = express.Router();

router.post('/register', validateMiddleware.validateRegister, rateLimitMiddleware, authController.register);
router.post('/login', validateMiddleware.validateLogin, rateLimitMiddleware, authController.login);

module.exports = router;