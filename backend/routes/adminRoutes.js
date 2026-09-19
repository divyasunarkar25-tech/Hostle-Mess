const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', adminAuthMiddleware, getAdminProfile);

module.exports = router;
