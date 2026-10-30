const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'roshani_traders_super_secret_jwt_key_2026_wholesale', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, businessName, business_name, mobile, email, password, address, city } = req.body;
    const finalBusinessName = businessName || business_name;

    if (!name || !finalBusinessName || !mobile || !email || !password || !address || !city) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      businessName: finalBusinessName,
      mobile,
      email,
      password,
      address,
      city,
      role: 'customer',
      status: 'active'
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        _id: String(user.id),
        name: user.name,
        businessName: user.businessName,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findByEmail(email);
    if (!user || !(await User.matchPassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact admin.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        _id: String(user.id),
        name: user.name,
        businessName: user.businessName,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin login user
// @route   POST /api/auth/admin-login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide admin email and password' });
    }

    const user = await User.findByEmail(email);
    if (!user || !(await User.matchPassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Admin account has been deactivated.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        _id: String(user.id),
        name: user.name,
        businessName: user.businessName,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        city: user.city,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, businessName, business_name, mobile, address, city } = req.body;
    const finalBusinessName = businessName || business_name;

    const user = await User.update(req.user.id, {
      name,
      businessName: finalBusinessName,
      mobile,
      address,
      city
    });

    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser, data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
