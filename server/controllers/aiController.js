const AIService = require('../services/aiService');

// @desc    Process chat query with AI Engine
// @route   POST /api/ai/chat
// @access  Public
exports.processAIChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide a valid query message' });
    }

    const aiResponse = await AIService.processChat(message, { user: req.user });
    res.json({
      success: true,
      ...aiResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      reply: 'Sorry, the Roshani AI Auto Parts Assistant encountered a temporary server error. Please try again or browse our catalogue manually.',
      products: [],
      type: 'text'
    });
  }
};

// @desc    Get AI product recommendations
// @route   POST /api/ai/recommend
// @access  Public
exports.getAIRecommendations = async (req, res) => {
  try {
    const { query, maxPrice, model } = req.body;
    const aiResponse = await AIService.handleProductSearch(query || '', maxPrice, model);
    res.json({ success: true, ...aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI summary for enquiry
// @route   POST /api/ai/summarize-enquiry
// @access  Public / Private
exports.summarizeEnquiry = async (req, res) => {
  try {
    const { enquiry, message, subject, name, businessName } = req.body;
    const enquiryData = enquiry || {
      message: message || '',
      subject: subject || '',
      name: name || 'Customer',
      businessName: businessName || 'Wholesale Partner'
    };
    const summary = await AIService.generateEnquirySummary(enquiryData);
    res.json({ success: true, summary, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

