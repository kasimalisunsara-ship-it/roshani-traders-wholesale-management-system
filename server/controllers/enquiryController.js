const Enquiry = require('../models/Enquiry');
const AIService = require('../services/aiService');

// @desc    Submit contact enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
  try {
    const { name, businessName, business_name, mobile, email, subject, message } = req.body;
    const finalBusinessName = businessName || business_name;

    if (!name || !finalBusinessName || !mobile || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all enquiry details' });
    }

    let enquiry = await Enquiry.create({
      userId: req.user ? req.user.id : null,
      name,
      businessName: finalBusinessName,
      mobile,
      email,
      subject,
      message
    });

    // Auto-generate AI summary
    try {
      const aiSummary = await AIService.summarizeEnquiry(enquiry);
      enquiry = await Enquiry.updateAiSummary(enquiry.id, aiSummary);
    } catch (aiErr) {
      console.warn('AI Enquiry summary auto-generation warning:', aiErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. Our wholesale team will respond shortly.',
      enquiry,
      data: enquiry
    });
  } catch (error) {
    console.error('createEnquiry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/enquiries
// @access  Private/Admin
exports.getEnquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const enquiries = await Enquiry.findAll(status || null);
    res.json({ success: true, count: enquiries.length, enquiries, data: enquiries });
  } catch (error) {
    console.error('getEnquiries error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enquiry status (Admin)
// @route   PUT /api/enquiries/:id/status or PUT /api/enquiries/:id
// @access  Private/Admin
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    const updated = await Enquiry.updateStatus(req.params.id, status || 'Reviewed');
    res.json({ success: true, enquiry: updated, data: updated });
  } catch (error) {
    console.error('updateEnquiryStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    await Enquiry.delete(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('deleteEnquiry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate / Regenerate AI Summary for Enquiry (Admin)
// @route   POST /api/enquiries/:id/ai-summary
// @access  Private/Admin
exports.generateAISummary = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    const aiSummary = await AIService.summarizeEnquiry(enquiry);
    const updated = await Enquiry.updateAiSummary(req.params.id, aiSummary);

    res.json({ success: true, aiSummary, enquiry: updated, data: updated });
  } catch (error) {
    console.error('generateAISummary error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
