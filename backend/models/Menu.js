const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    day: { type: String, required: true, unique: true },
    breakfast: { type: String },
    lunch: { type: String },
    snacks: { type: String },
    dinner: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
