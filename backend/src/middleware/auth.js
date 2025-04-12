const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secure-jwt-secret_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };