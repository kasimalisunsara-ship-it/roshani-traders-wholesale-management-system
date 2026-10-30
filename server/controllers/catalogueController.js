const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * Helper: Find or create Category by Name
 */
const resolveCategory = async (catName) => {
  if (!catName || !catName.trim()) catName = 'Three Wheeler Spare Parts';
  const trimmed = catName.trim();
  let category = await Category.findByName(trimmed);
  if (!category) {
    category = await Category.create({
      name: trimmed,
      description: `Wholesale ${trimmed} for three-wheelers`,
      image: '/images/products/mudguard-set.webp'
    });
  }
  return category;
};

/**
 * @desc    Bulk Import & Sync Catalogue Data (CSV/JSON)
 * @route   POST /api/catalogue/import
 * @access  Admin
 */
exports.importCatalogue = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No product array provided for import'
      });
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let errors = [];

    for (let p of products) {
      try {
        if (!p.name || !p.name.trim()) continue;

        const productName = p.name.trim();
        const categoryDoc = await resolveCategory(p.category || p.categoryName || 'Three Wheeler Spare Parts');

        const productData = {
          name: productName,
          description: p.description || `${productName} for commercial three wheelers. Original quality guarantee.`,
          category_id: categoryDoc.id,
          brand: p.brand && p.brand !== 'Not specified' ? p.brand : 'Roshani Traders',
          price: Number(p.price) > 0 ? Number(p.price) : 100,
          moq: Number(p.MOQ || p.moq) > 0 ? Number(p.MOQ || p.moq) : 10,
          stock: Number(p.stock) >= 0 ? Number(p.stock) : 100,
          availability: p.availability !== undefined ? Boolean(p.availability) : true,
          image: p.image || p.imageUrl || '/images/products/mudguard-set.webp',
          compatibleModels: Array.isArray(p.compatibleModels)
            ? p.compatibleModels
            : (typeof p.compatible_models === 'string'
                ? p.compatible_models.split(',').map(m => m.trim())
                : ['Bajaj RE', 'Piaggio Ape', 'TVS King']),
          specifications: typeof p.specifications === 'object' ? p.specifications : {},
          status: p.status || 'active'
        };

        // Check duplicate by exact name or ID
        const existingRes = await Product.findAll({ search: productName, limit: 1 });
        const existing = existingRes.products.find(x => x.name.toLowerCase() === productName.toLowerCase());

        if (existing) {
          await Product.update(existing.id, productData);
          updatedCount++;
        } else {
          await Product.create(productData);
          insertedCount++;
        }
      } catch (err) {
        errors.push({ product: p.name, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Catalogue import finished. Inserted: ${insertedCount}, Updated: ${updatedCount}`,
      insertedCount,
      updatedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('importCatalogue error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Catalogue Validation Report
 * @route   GET /api/catalogue/report
 * @access  Admin
 */
exports.getValidationReport = async (req, res) => {
  try {
    const { products, total } = await Product.findAll({ limit: 1000 });
    const categories = await Category.findAll();

    const inStock = products.filter(p => p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;
    const missingImages = products.filter(p => !p.image || p.image.includes('placeholder')).length;

    res.json({
      success: true,
      report: {
        totalProducts: total,
        totalCategories: categories.length,
        inStockCount: inStock,
        outOfStockCount: outOfStock,
        missingImagesCount: missingImages,
        categories: categories.map(c => ({ name: c.name, productCount: c.productCount || 0 }))
      }
    });
  } catch (error) {
    console.error('getValidationReport error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get CSV Template for Catalogue Import
 * @route   GET /api/catalogue/template
 * @access  Public
 */
exports.getCsvTemplate = async (req, res) => {
  const csvHeaders = 'name,category,brand,price,moq,stock,description,compatible_models\n';
  const sampleRow = 'Heavy Duty Front Bumper,Body Parts,Roshani Genuine,1850.00,10,120,"High-grade steel front bumper","Bajaj RE,Piaggio Ape"\n';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="roshani_catalogue_template.csv"');
  res.send(csvHeaders + sampleRow);
};

