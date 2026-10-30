const express = require('express');
const router = express.Router();
const {
  createQuote,
  getMyQuotes,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  getTrackingByCode,
  updateTrackingInfo
} = require('../controllers/quoteController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createQuote);
router.get('/my-quotes', protect, getMyQuotes);
router.get('/track/:code', getTrackingByCode);
router.get('/:id', protect, getQuoteById);
router.get('/', protect, authorize('admin'), getAllQuotes);
router.put('/:id/status', protect, authorize('admin'), updateQuoteStatus);
router.put('/:id/tracking', protect, authorize('admin'), updateTrackingInfo);

module.exports = router;

