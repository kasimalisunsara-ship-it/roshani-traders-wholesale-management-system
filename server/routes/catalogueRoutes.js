const express = require('express');
const router = express.Router();
const { importCatalogue, getValidationReport, getCsvTemplate } = require('../controllers/catalogueController');
const { protect, admin } = require('../middleware/auth');

router.post('/import', protect, admin, importCatalogue);
router.get('/report', protect, admin, getValidationReport);
router.get('/template', getCsvTemplate);

module.exports = router;
