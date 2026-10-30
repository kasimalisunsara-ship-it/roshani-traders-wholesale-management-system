const express = require('express');
const router = express.Router();
const { getAllContent, getContentByPage, updateContentByPage } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllContent);
router.get('/:page', getContentByPage);
router.put('/:page', protect, authorize('admin'), updateContentByPage);
router.put('/:id', protect, authorize('admin'), updateContentByPage);

module.exports = router;

