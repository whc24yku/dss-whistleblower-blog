const express = require('express');
const questionController = require('../controllers/questionController');
const { authenticateToken } = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');
const router = express.Router();

// Routes for handling questions
router.post('/questions', authenticateToken, validateMiddleware.validateQuestion, questionController.createQuestion);
router.post('/questions/:id/vote', authenticateToken, validateMiddleware.validateVote, questionController.voteQuestion);
router.get('/questions', authenticateToken, questionController.getQuestions);

module.exports = router;
