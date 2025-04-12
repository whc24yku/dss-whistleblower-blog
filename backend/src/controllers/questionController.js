const questionModel = require('../models/question');

async function createQuestion(req, res, next) {
    const { title, content } = req.body;
    const user_id = req.user.id; // From JWT

    try {
        const question = await questionModel.createQuestion(user_id, title, content);
        res.status(201).json({ status: "success", question });
    } catch (err) {
        next(err);
    }
}

async function voteQuestion(req, res, next) {
    const { vote_type } = req.body; // 'up' or 'down'
    const question_id = req.params.id;
    const user_id = req.user.id; // From JWT

    // Validate vote type
    if (!['up', 'down'].includes(vote_type)) {
        return res.status(400).json({ error: 'Invalid vote type' });
    }

    try {
        // Check if the user has already voted on the question
        const existingVote = await questionModel.getVoteByUserAndQuestion(user_id, question_id);

        if (existingVote) {
            // If user has voted, update the vote (toggle up/down)
            if (existingVote.vote_type === vote_type) {
                return res.status(400).json({ error: `You've already voted ${vote_type} on this question` });
            }

            // Update the vote
            const updatedVote = await questionModel.updateVote(user_id, question_id, vote_type);
            return res.status(200).json({ status: 'success', vote_id: updatedVote.id });
        } else {
            // Insert a new vote for the question
            const newVote = await questionModel.createVote(user_id, question_id, vote_type);
            return res.status(201).json({ status: 'success', vote_id: newVote.id });
        }
    } catch (err) {
        if (err.code === '23503') { // Foreign key violation
            return res.status(404).json({ error: 'Question not found' });
        }
        next(err);
    }
}

async function getQuestions(req, res, next) {
    try {
        const questions = await questionModel.getQuestions();
        res.status(200).json({ status: 'success', questions });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createQuestion,
    voteQuestion,
    getQuestions
};
