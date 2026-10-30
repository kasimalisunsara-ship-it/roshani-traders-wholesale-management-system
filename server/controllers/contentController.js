const Content = require('../models/Content');

// @desc    Get all website CMS contents or by page
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const contents = await Content.findAll();
    const faqs = await Content.getFaqs();
    res.json({ success: true, contents, faqs, data: contents });
  } catch (error) {
    console.error('getAllContent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get website CMS content by page or ID
// @route   GET /api/content/:page
// @access  Public
exports.getContentByPage = async (req, res) => {
  try {
    const identifier = req.params.page || 'home';
    if (!isNaN(identifier)) {
      const content = await Content.findById(identifier);
      if (content) return res.json({ success: true, content, data: content });
    }
    const content = await Content.findByPage(identifier);
    res.json({ success: true, content, data: content });
  } catch (error) {
    console.error('getContentByPage error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update CMS content by page or ID
// @route   PUT /api/content/:id
// @access  Private/Admin
exports.updateContentByPage = async (req, res) => {
  try {
    const identifier = req.params.page || req.params.id || 'home';
    let content;
    if (!isNaN(identifier)) {
      content = await Content.updateById(identifier, req.body);
    } else {
      content = await Content.updateByPage(identifier, req.body);
    }
    res.json({ success: true, content, data: content });
  } catch (error) {
    console.error('updateContentByPage error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

