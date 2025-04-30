const express = require('express');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const questionRoutes = require('./routes/questions');
require('dotenv').config();


const app = express();

app.use(express.json());

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

// CORS for local development
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', questionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
