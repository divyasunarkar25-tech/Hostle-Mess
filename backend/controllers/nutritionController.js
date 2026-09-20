const Nutrition = require('../models/Nutrition');
const fs = require('fs/promises');

const nutritionPrompt = `Analyze this food image. Return ONLY valid JSON in this exact format:
{
  "foodName": "identified food name",
  "nutrition": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0 },
  "aiResponse": "Brief serving-size assumption and uncertainty."
}
Estimate one visible serving. Use numeric values for all nutrition fields.`;

const parseNutrition = (text) => {
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(cleaned);
    const nutrition = parsed.nutrition || {};
    if (!parsed.foodName) throw new Error('Gemini did not identify a food name.');

    return {
        foodName: String(parsed.foodName).trim(),
        nutrition: {
            calories: Number(nutrition.calories) || 0,
            protein: Number(nutrition.protein) || 0,
            carbs: Number(nutrition.carbs) || 0,
            fat: Number(nutrition.fat) || 0,
            fiber: Number(nutrition.fiber) || 0,
            aiResponse: String(parsed.aiResponse || 'Nutrition estimate generated from the uploaded image.').trim()
        }
    };
};

const analyzeWithGemini = async (file) => {
    const image = await fs.readFile(file.path);
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.AI_API_KEY)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [
                    { text: nutritionPrompt },
                    { inlineData: { mimeType: file.mimetype, data: image.toString('base64') } }
                ] }],
                generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
            })
        }
    );
    const payload = await response.json();
    if (!response.ok) {
        console.error('Gemini nutrition analysis failed:', payload?.error?.message || response.status);
        throw new Error('Gemini could not analyze this image right now. Please try again.');
    }
    const text = payload?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!text) throw new Error('Gemini returned no nutrition result.');
    return parseNutrition(text);
};

const analyzeNutrition = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a food image.' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        if (!process.env.AI_API_KEY) {
            return res.status(503).json({
                success: false,
                message: 'Nutrition analysis is temporarily unavailable.'
            });
        }

        const analysis = await analyzeWithGemini(req.file);
        const entry = await Nutrition.create({
            foodName: analysis.foodName,
            imageUrl,
            nutrition: analysis.nutrition
        });
        res.status(201).json({
            success: true,
            message: 'Analysis saved',
            imageUrl,
            data: analysis,
            entry
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
            user: req.user?.id,
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
