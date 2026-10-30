const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const includeInactive = req.query.admin === 'true';
    const categories = await Category.findAll(includeInactive);
    res.json({
      success: true,
      count: categories.length,
      categories,
      data: categories
    });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category, data: category });
  } catch (error) {
    console.error('createCategory error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.update(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category, data: category });
  } catch (error) {
    console.error('updateCategory error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await Category.delete(req.params.id);
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    console.error('deleteCategory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
