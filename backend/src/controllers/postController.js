const postModel = require('../models/post');

const postController = {
    async createPost(req, res, next) {
        const { title, content } = req.body;
        const user_id = req.user.id; // From JWT
        try {
            const post = await postModel.createPost(user_id, title, content);
            res.status(201).json({ status: "success", post_id: post.id });
        } catch (err) {
            next(err);
        }
    },

    async votePost(req, res, next) {
        const { vote_type } = req.body; // Vote type should be 'up' or 'down'
        const post_id = req.params.id;  // Post to vote on
        const user_id = req.user.id;    // User voting (from JWT)
    
        // Validate vote type (only 'up' or 'down' allowed)
        if (!['up', 'down'].includes(vote_type)) {
            return res.status(400).json({ error: 'Invalid vote type' });
        }
    
        try {
            // Try to find if the user has already voted for this post
            const existingVote = await postModel.getVoteByUserAndPost(user_id, post_id);
    
            if (existingVote) {
                // User has voted before, so we update their vote type
                if (existingVote.vote_type === vote_type) {
                    // If they try to vote the same type, return a message indicating they've already voted
                    return res.status(400).json({ error: `You've already voted ${vote_type} on this post` });
                }
    
                // Update the user's vote type (toggle between 'up' and 'down')
                const updatedVote = await postModel.updateVote(user_id, post_id, vote_type);
                return res.status(200).json({ status: 'success', vote_id: updatedVote.id });
            } else {
                // No existing vote, so insert a new vote
                const newVote = await postModel.createVote(user_id, post_id, vote_type);
                return res.status(201).json({ status: 'success', vote_id: newVote.id });
            }
        } catch (err) {
            if (err.code === '23503') { // Foreign key violation
                return res.status(404).json({ error: 'Post not found' });
            }
            next(err);
        }
    },
    

    async getPosts(req, res, next) {
        try {
            const posts = await postModel.getAllPosts();
            res.json({ status: "success", posts });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = postController;