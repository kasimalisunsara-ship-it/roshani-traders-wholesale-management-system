const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filters & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const result = await Product.findAll({
      category: req.query.category,
      brand: req.query.brand,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      availability: req.query.availability,
      search: req.query.search,
      sort: req.query.sort,
      model: req.query.model,
      admin: req.query.admin === 'true',
      page: req.query.page,
      limit: req.query.limit
    });

    const brands = await Product.getDistinctBrands();

    res.json({
      success: true,
      count: result.count,
      total: result.total,
      pages: result.pages,
      page: result.page,
      brands,
      products: result.products,
      data: result.products
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (!isNaN(id)) {
      product = await Product.findById(parseInt(id, 10));
    }
    if (!product) {
      product = await Product.findBySlug(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product, data: product });
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    let { name, category, category_id, description, price, MOQ, moq, stock, brand, image, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    // Resolve category ID
    let finalCategoryId = parseInt(category_id || category, 10);
    if (isNaN(finalCategoryId)) {
      const catName = typeof category === 'string' && category.trim() ? category.trim() : 'Body Parts & Panels';
      let foundCat = await Category.findByName(catName);
      if (!foundCat) {
        foundCat = await Category.create({ name: catName, description: 'Three Wheeler Spare Parts' });
      }
      finalCategoryId = foundCat.id;
    }

    const product = await Product.create({
      name: name.trim(),
      category_id: finalCategoryId,
      description: description || 'Genuine high quality three-wheeler spare part from Roshani Traders.',
      price: Number(price) >= 0 ? Number(price) : 100,
      moq: Number(moq || MOQ) >= 1 ? Number(moq || MOQ) : 10,
      stock: Number(stock) >= 0 ? Number(stock) : 100,
      brand: brand ? brand.trim() : 'Roshani Traders',
      image: image || '/images/products/mudguard-set.webp',
      status: status || 'active',
      availability: status !== 'inactive'
    });

    res.status(201).json({ success: true, product, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let updateData = { ...req.body };

    // Resolve category if provided
    if (updateData.category && isNaN(updateData.category)) {
      const catName = typeof updateData.category === 'string' && updateData.category.trim() ? updateData.category.trim() : 'Body Parts & Panels';
      let foundCat = await Category.findByName(catName);
      if (!foundCat) {
        foundCat = await Category.create({ name: catName, description: 'Three Wheeler Spare Parts' });
      }
      updateData.category_id = foundCat.id;
    } else if (updateData.category && !isNaN(updateData.category)) {
      updateData.category_id = parseInt(updateData.category, 10);
    }

    if (updateData.MOQ !== undefined && updateData.moq === undefined) {
      updateData.moq = updateData.MOQ;
    }

    const updated = await Product.update(id, updateData);
    res.json({ success: true, product: updated, data: updated });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.delete(req.params.id);
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete all products
// @route   DELETE /api/products/clear/all
// @access  Private/Admin
exports.deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteAll();
    res.json({ success: true, message: 'All products removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle product status (active/inactive)
// @route   PUT /api/products/:id/status
// @access  Private/Admin
exports.toggleProductStatus = async (req, res) => {
  try {
    const updated = await Product.toggleStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product: updated, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
