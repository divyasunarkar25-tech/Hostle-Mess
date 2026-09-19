const express = require('express');
const router = express.Router();
const { getMenu, getMenuByDay, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const adminAuth = require('../middleware/adminAuthMiddleware');
const userAuth = require('../middleware/authMiddleware');

// Public routes for users + admins to see
router.get('/', getMenu);
router.get('/:day', getMenuByDay);

// Protected admin routes for CRUD operations
router.post('/', adminAuth, createMenu);
router.put('/:day', adminAuth, updateMenu);
router.delete('/:day', adminAuth, deleteMenu);

module.exports = router;
