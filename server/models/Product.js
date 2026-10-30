const { query } = require('../config/db');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseJSON(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function formatProduct(row) {
  if (!row) return null;

  const compatible = parseJSON(row.compatible_models, ['Bajaj RE', 'Piaggio Ape', 'TVS King']);
  const specs = parseJSON(row.specifications, {});
  const img = row.image || '/images/products/mudguard-set.webp';

  return {
    id: row.id,
    _id: String(row.id),
    categoryId: row.category_id,
    category_id: row.category_id,
    category: row.category_id ? {
      id: row.category_id,
      _id: String(row.category_id),
      name: row.category_name || '',
      slug: row.category_slug || ''
    } : null,
    categoryName: row.category_name || '',
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    brand: row.brand || 'Roshani Traders',
    price: Number(row.price || 0),
    moq: Number(row.moq || 1),
    MOQ: Number(row.moq || 1),
    stock: Number(row.stock || 0),
    availability: Boolean(row.availability),
    image: img,
    images: [img],
    specifications: specs,
    compatibleModels: compatible,
    compatible_models: compatible,
    status: row.status || 'active',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class Product {
  static async findAll(options = {}) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      availability,
      search,
      sort,
      model,
      admin = false,
      page = 1,
      limit = 12
    } = options;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
    const offset = (pageNum - 1) * limitNum;

    const whereClauses = [];
    const params = [];

    // Active status filter (unless admin=true)
    if (!admin) {
      whereClauses.push("p.status = 'active'");
    }

    // Category filter (by ID or Slug or Name)
    if (category) {
      if (!isNaN(category)) {
        whereClauses.push("p.category_id = ?");
        params.push(parseInt(category, 10));
      } else {
        whereClauses.push("(c.slug = ? OR c.slug LIKE ? OR c.name LIKE ?)");
        params.push(category, `%${category}%`, `%${category}%`);
      }
    }

    // Brand filter
    if (brand) {
      whereClauses.push("p.brand LIKE ?");
      params.push(`%${brand}%`);
    }

    // Model compatibility filter
    if (model) {
      whereClauses.push("JSON_SEARCH(p.compatible_models, 'one', ?) IS NOT NULL");
      params.push(`%${model}%`);
    }

    // Availability filter
    if (availability === 'true' || availability === true) {
      whereClauses.push("p.availability = 1 AND p.stock > 0");
    }

    // Price range
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      whereClauses.push("p.price >= ?");
      params.push(Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      whereClauses.push("p.price <= ?");
      params.push(Number(maxPrice));
    }

    // Search query across name, brand, description, and category name
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      whereClauses.push("(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ? OR c.name LIKE ?)");
      params.push(term, term, term, term);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count query
    const countSql = `
      SELECT COUNT(*) AS total
      FROM \`products\` p
      LEFT JOIN \`categories\` c ON c.id = p.category_id
      ${whereSql}
    `;
    const countRows = await query(countSql, params);
    const total = countRows[0]?.total || 0;

    // Sorting
    let orderBy = 'p.created_at DESC';
    if (sort === 'price-asc') orderBy = 'p.price ASC';
    else if (sort === 'price-desc') orderBy = 'p.price DESC';
    else if (sort === 'name-asc') orderBy = 'p.name ASC';

    // Data query
    const dataSql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM \`products\` p
      LEFT JOIN \`categories\` c ON c.id = p.category_id
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const rows = await query(dataSql, [...params, limitNum, offset]);

    return {
      products: rows.map(formatProduct),
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: rows.length
    };
  }

  static async findById(id) {
    const sql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM \`products\` p
      LEFT JOIN \`categories\` c ON c.id = p.category_id
      WHERE p.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return formatProduct(rows[0]);
  }

  static async findBySlug(slug) {
    const sql = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM \`products\` p
      LEFT JOIN \`categories\` c ON c.id = p.category_id
      WHERE p.slug = ?
      LIMIT 1
    `;
    const rows = await query(sql, [slug]);
    return formatProduct(rows[0]);
  }

  static async getDistinctBrands() {
    const rows = await query("SELECT DISTINCT `brand` FROM `products` WHERE `status` = 'active' AND `brand` IS NOT NULL AND `brand` != '' ORDER BY `brand` ASC");
    return rows.map(r => r.brand);
  }

  static async create(data) {
    const name = (data.name || '').trim();
    const slug = data.slug || `${slugify(name)}-${Date.now()}`;
    const categoryId = parseInt(data.category_id || data.categoryId || data.category, 10);
    const description = data.description || '';
    const brand = data.brand || 'Roshani Traders';
    const price = Number(data.price || 0);
    const moq = parseInt(data.moq || data.MOQ || 1, 10);
    const stock = parseInt(data.stock || 0, 10);
    const availability = data.availability !== undefined ? (data.availability ? 1 : 0) : 1;
    const image = data.image || '/images/products/mudguard-set.webp';
    const specifications = JSON.stringify(typeof data.specifications === 'object' ? data.specifications : {});
    const compatibleModels = JSON.stringify(Array.isArray(data.compatibleModels || data.compatible_models)
      ? (data.compatibleModels || data.compatible_models)
      : ['Bajaj RE', 'Piaggio Ape', 'TVS King']);
    const status = data.status || 'active';

    const result = await query(
      `INSERT INTO \`products\` (\`category_id\`, \`name\`, \`slug\`, \`description\`, \`brand\`, \`price\`, \`moq\`, \`stock\`, \`availability\`, \`image\`, \`specifications\`, \`compatible_models\`, \`status\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [categoryId, name, slug, description, brand, price, moq, stock, availability, image, specifications, compatibleModels, status]
    );

    return await this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('`name` = ?'); values.push(data.name.trim()); }
    if (data.slug !== undefined) { fields.push('`slug` = ?'); values.push(slugify(data.slug)); }
    if (data.category_id !== undefined || data.categoryId !== undefined || data.category !== undefined) {
      const catId = parseInt(data.category_id || data.categoryId || data.category, 10);
      if (!isNaN(catId)) {
        fields.push('`category_id` = ?');
        values.push(catId);
      }
    }
    if (data.description !== undefined) { fields.push('`description` = ?'); values.push(data.description); }
    if (data.brand !== undefined) { fields.push('`brand` = ?'); values.push(data.brand); }
    if (data.price !== undefined) { fields.push('`price` = ?'); values.push(Number(data.price)); }
    if (data.moq !== undefined || data.MOQ !== undefined) { fields.push('`moq` = ?'); values.push(parseInt(data.moq || data.MOQ, 10)); }
    if (data.stock !== undefined) { fields.push('`stock` = ?'); values.push(parseInt(data.stock, 10)); }
    if (data.availability !== undefined) { fields.push('`availability` = ?'); values.push(data.availability ? 1 : 0); }
    if (data.image !== undefined) { fields.push('`image` = ?'); values.push(data.image); }
    if (data.specifications !== undefined) { fields.push('`specifications` = ?'); values.push(JSON.stringify(data.specifications)); }
    if (data.compatibleModels !== undefined || data.compatible_models !== undefined) {
      fields.push('`compatible_models` = ?');
      values.push(JSON.stringify(data.compatibleModels || data.compatible_models));
    }
    if (data.status !== undefined) {
      fields.push('`status` = ?');
      values.push(data.status);
      if (data.availability === undefined) {
        fields.push('`availability` = ?');
        values.push(data.status === 'active' ? 1 : 0);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      await query(`UPDATE \`products\` SET ${fields.join(', ')} WHERE \`id\` = ?`, values);
    }

    return await this.findById(id);
  }

  static async delete(id) {
    await query('DELETE FROM `products` WHERE `id` = ?', [id]);
    return true;
  }

  static async deleteAll() {
    await query('DELETE FROM `products`');
    return true;
  }

  static async toggleStatus(id, newStatus = null) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const nextStatus = newStatus || (existing.status === 'active' ? 'inactive' : 'active');
    const isAvail = nextStatus === 'active' ? 1 : 0;
    await query('UPDATE `products` SET `status` = ?, `availability` = ? WHERE `id` = ?', [nextStatus, isAvail, id]);
    return await this.findById(id);
  }
}

module.exports = Product;
