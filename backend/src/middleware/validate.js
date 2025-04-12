const validateMiddleware = {
    validateRegister(req, res, next) {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({ error: 'Username must be 3-50 characters' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }
        next();
    },

    validateLogin(req, res, next) {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Identifier and password are required' });
        }
        next();
    },

    validatePost(req, res, next) {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        if (title.length > 255) {
            return res.status(400).json({ error: 'Title must be under 255 characters' });
        }
        next();
    },

    validateVote(req, res, next) {
        const { vote_type } = req.body;
        if (!['up', 'down'].includes(vote_type)) {
            return res.status(400).json({ error: 'Vote type must be either "up" or "down"' });
        }
        next();
    },

    validateQuestion(req, res, next) {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        next();
    }
};

module.exports = validateMiddleware;