const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  generateAISummary
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createEnquiry);
router.get('/', protect, authorize('admin'), getEnquiries);
router.put('/:id', protect, authorize('admin'), updateEnquiryStatus);
router.put('/:id/status', protect, authorize('admin'), updateEnquiryStatus);
router.delete('/:id', protect, authorize('admin'), deleteEnquiry);
router.post('/:id/ai-summary', protect, authorize('admin'), generateAISummary);

module.exports = router;
