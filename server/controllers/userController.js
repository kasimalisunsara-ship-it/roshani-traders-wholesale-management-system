const User = require('../models/User');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const role = req.query.role || 'customer';
    const users = await User.findAll(role);
    res.json({ success: true, count: users.length, users, data: users });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (Admin)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = await User.updateStatus(req.params.id, status);
    res.json({ success: true, user: updated, data: updated });
  } catch (error) {
    console.error('updateUserStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
