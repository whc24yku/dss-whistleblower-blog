const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const router = express.Router();

const JWT_SECRET = 'your-secure-jwt-secret\_secret'; 

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Register user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
            [username, email, password_hash]
        );
        const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create post (authenticated)
router.post('/posts', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, title, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

// Upvote/downvote post (authenticated)
router.post('/posts/:id/vote', authenticateToken, async (req, res) => {
    const { vote_type } = req.body; // true for upvote, false for downvote
    const post_id = req.params.id;
    try {
        const result = await pool.query(
            'INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3) ON CONFLICT (user_id, post_id) DO UPDATE SET vote_type = $3 RETURNING *',
            [req.user.id, post_id, vote_type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

module.exports = router;