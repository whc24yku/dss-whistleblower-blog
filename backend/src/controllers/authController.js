const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
require('dotenv').config();

const authController = {
    async register(req, res, next) {
        const { username, email, password } = req.body;
        try {
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(password, saltRounds);
            const user = await userModel.createUser(username, email, password_hash);
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secure-jwt-secret_secret', { expiresIn: '1h' });
            res.json({ status: "success", user_id: user.id, token });
        } catch (err) {
            if (err.code === '23505') { // Unique violation
                return res.status(400).json({ error: 'Username or email already exists' });
            }
            next(err);
        }
    },

    async login(req, res, next) {
        const { identifier, password } = req.body;
        try {
            let user = await userModel.findUserByUsername(identifier);
            if (!user) {
                user = await userModel.findUserByEmail(identifier);
            }
            if (!user || !(await bcrypt.compare(password, user.password_hash))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secure-jwt-secret_secret', { expiresIn: '1h' });
            res.json({ status: "success", user_id: user.id, token });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = authController;