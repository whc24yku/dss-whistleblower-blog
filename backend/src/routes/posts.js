const express = require('express');
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');
const router = express.Router();

router.post('/posts', authenticateToken, validateMiddleware.validatePost, postController.createPost);
router.post('/posts/:id/vote', authenticateToken, validateMiddleware.validateVote, postController.votePost);
router.get('/posts', authenticateToken, postController.getPosts);

module.exports = router;