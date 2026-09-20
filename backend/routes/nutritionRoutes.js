const express = require('express');
const router = express.Router();
const { analyzeNutrition, saveNutrition, getSharedNutrition } = require('../controllers/nutritionController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists so server won't crash when using diskStorage
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Utilize diskStorage for physical saving since this MVP has no cloud storage configured.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/analyze', upload.single('foodImage'), analyzeNutrition);
router.post('/', saveNutrition);
router.get('/', getSharedNutrition);

module.exports = router;
