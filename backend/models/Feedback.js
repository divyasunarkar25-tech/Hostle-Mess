const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String },
    email: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    quality: { type: Number, required: true, min: 1, max: 5 },
    quantity: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
