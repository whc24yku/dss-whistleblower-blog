const pool = require('../../config/db'); 

// Method to create a new question
async function createQuestion(user_id, title, content) {
    const result = await pool.query(
        'INSERT INTO questions (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, user_id, title, content',
        [user_id, title, content]
    );
    return result.rows[0];
}

// Method to get all questions
async function getQuestions() {
    const result = await pool.query('SELECT * FROM questions');
    return result.rows;
}

// Method to check if the user has voted on a question
async function getVoteByUserAndQuestion(user_id, question_id) {
    const result = await pool.query(
        'SELECT id, user_id, question_id, vote_type FROM votes WHERE user_id = $1 AND question_id = $2',
        [user_id, question_id]
    );
    return result.rows[0]; // Returns null if no vote exists
}

// Method to create a vote for a question
async function createVote(user_id, question_id, vote_type) {
    const result = await pool.query(
        'INSERT INTO votes (user_id, question_id, vote_type) VALUES ($1, $2, $3) RETURNING id, user_id, question_id, vote_type',
        [user_id, question_id, vote_type]
    );
    return result.rows[0];
}

// Method to update the vote type of an existing vote
async function updateVote(user_id, question_id, vote_type) {
    const result = await pool.query(
        'UPDATE votes SET vote_type = $3 WHERE user_id = $1 AND question_id = $2 RETURNING id, user_id, question_id, vote_type',
        [user_id, question_id, vote_type]
    );
    return result.rows[0];
}

module.exports = {
    createQuestion,
    getQuestions,
    getVoteByUserAndQuestion,
    createVote,
    updateVote
};
