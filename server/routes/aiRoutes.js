const express = require('express');
const router = express.Router();
const { processAIChat, getAIRecommendations, summarizeEnquiry } = require('../controllers/aiController');

router.post('/chat', processAIChat);
router.post('/recommend', getAIRecommendations);
router.post('/summarize-enquiry', summarizeEnquiry);

module.exports = router;

