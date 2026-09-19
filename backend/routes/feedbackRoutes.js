const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback, getMyFeedback } = require('../controllers/feedbackController');
const adminAuth = require('../middleware/adminAuthMiddleware');
const userAuth = require('../middleware/authMiddleware');

// User routes
router.post('/', userAuth, createFeedback);
router.get('/my', userAuth, getMyFeedback);

// Admin route
router.get('/', adminAuth, getAllFeedback);

module.exports = router;
