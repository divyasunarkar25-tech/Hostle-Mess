const Nutrition = require('../models/Nutrition');

const analyzeNutrition = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a food image.' });
        }

        // Capture the static server URL piece for the saved file
        const imageUrl = `/uploads/${req.file.filename}`;

        if (!process.env.AI_API_KEY) {
            // Still return the URL so we can save and preview even without real AI
            return res.status(200).json({
                success: false,
                message: 'Nutrition AI is not configured yet. Please configure AI_API_KEY in backend/.env',
                data: null,
                imageUrl
            });
        }

        // Extracted dummy logic mimicking Gemini return
        res.status(200).json({
            success: true,
            message: 'Analysis retrieved (simulated)',
            imageUrl,
            data: {
                name: 'Sample Analyzed Meal',
                calories: 320,
                protein: 15,
                carbs: 45,
                fat: 12,
                fiber: 4
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const saveNutrition = async (req, res) => {
    try {
        const { foodName, imageUrl, nutrition } = req.body;

        if (!foodName || !nutrition) {
            return res.status(400).json({ message: 'Missing required nutrition data' });
        }

        const entry = await Nutrition.create({
            user: req.user.id, // Derived securely from token
            foodName,
            imageUrl,
            nutrition
        });

        res.status(201).json({ success: true, message: 'Nutrition entry submitted', entry });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSharedNutrition = async (req, res) => {
    try {
        const entries = await Nutrition.find({})
            .populate('user', 'name')
            .sort({ createdAt: -1 }); // Newest first
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { analyzeNutrition, saveNutrition, getSharedNutrition };
