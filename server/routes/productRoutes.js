const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  toggleProductStatus
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.delete('/clear/all', deleteAllProducts);

router.route('/:id/status')
  .put(protect, authorize('admin'), toggleProductStatus);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
