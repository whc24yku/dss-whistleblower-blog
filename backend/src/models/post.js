const pool = require('../../config/db');

const postModel = {
    async createPost(user_id, title, content) {
        const result = await pool.query(
            'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, user_id, title, content, created_at',
            [user_id, title, content]
        );
        return result.rows[0];
    },

    async getVoteByUserAndPost(user_id, post_id) {
        const result = await pool.query(
            'SELECT id, user_id, post_id, vote_type FROM votes WHERE user_id = $1 AND post_id = $2',
            [user_id, post_id]
        );
        return result.rows[0]; // Will return null if no vote exists
    },

    async createVote(user_id, post_id, vote_type) {
        const result = await pool.query(
            'INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3) RETURNING id, user_id, post_id, vote_type',
            [user_id, post_id, vote_type]
        );
        return result.rows[0];
    },
    

    async getAllPosts() {
        const result = await pool.query('SELECT id, user_id, title, content, created_at FROM posts ORDER BY created_at DESC');
        return result.rows;
    }
};

module.exports = postModel;