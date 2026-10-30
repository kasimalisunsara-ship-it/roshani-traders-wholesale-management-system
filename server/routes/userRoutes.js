const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus } = require('../controllers/userController');
const { updateProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Customer profile update alias
router.put('/profile', protect, updateProfile);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.put('/:id/status', updateUserStatus);

module.exports = router;
