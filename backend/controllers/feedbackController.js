const Feedback = require('../models/Feedback');

const createFeedback = async (req, res) => {
    try {
        const { rating, quality, quantity, comment } = req.body;

        // Using `req.user` decoded from JWT so users can't spoof another user's ID
        const feedback = await Feedback.create({
            user: req.user.id,
            name: req.user.name || 'User', // Default fallback just in case
            email: req.user.email,
            rating,
            quality,
            quantity,
            comment
        });
        res.status(201).json({ success: true, message: 'Feedback submitted', feedback });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        // Populate user id to get name and email dynamically just in case
        const feedback = await Feedback.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMyFeedback = async (req, res) => {
    try {
        // Find feedback strictly for authenticated user
        const feedback = await Feedback.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createFeedback, getAllFeedback, getMyFeedback };
