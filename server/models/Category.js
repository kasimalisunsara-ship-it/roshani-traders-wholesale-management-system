const { query } = require('../config/db');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    status: row.status,
    productCount: row.product_count !== undefined ? Number(row.product_count) : 0,
    product_count: row.product_count !== undefined ? Number(row.product_count) : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class Category {
  static async findAll(includeInactive = false) {
    const sql = `
      SELECT c.*, COUNT(p.id) AS product_count
      FROM \`categories\` c
      LEFT JOIN \`products\` p ON p.category_id = c.id AND p.status = 'active'
      ${includeInactive ? '' : "WHERE c.status = 'active'"}
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const rows = await query(sql);
    return rows.map(formatCategory);
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM `categories` WHERE `id` = ? LIMIT 1', [id]);
    return formatCategory(rows[0]);
  }

  static async findByName(name) {
    if (!name) return null;
    const rows = await query('SELECT * FROM `categories` WHERE LOWER(`name`) = LOWER(?) LIMIT 1', [name.trim()]);
    if (rows.length > 0) return formatCategory(rows[0]);
    // Fallback to substring matching
    const searchRows = await query('SELECT * FROM `categories` WHERE `name` LIKE ? LIMIT 1', [`%${name.trim()}%`]);
    return formatCategory(searchRows[0]);
  }

  static async findBySlug(slug) {
    const rows = await query('SELECT * FROM `categories` WHERE `slug` = ? LIMIT 1', [slug]);
    return formatCategory(rows[0]);
  }

  static async create(data) {
    const name = (data.name || '').trim();
    const slug = data.slug || slugify(name);
    const description = data.description || '';
    const image = data.image || '/images/products/mudguard-set.webp';
    const status = data.status || 'active';

    const result = await query(
      `INSERT INTO \`categories\` (\`name\`, \`slug\`, \`description\`, \`image\`, \`status\`)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE \`description\` = VALUES(\`description\`), \`image\` = VALUES(\`image\`), \`status\` = VALUES(\`status\`)`,
      [name, slug, description, image, status]
    );

    const insertedId = result.insertId || (await this.findByName(name))?.id;
    return await this.findById(insertedId);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('`name` = ?');
      values.push(data.name.trim());
      if (!data.slug) {
        fields.push('`slug` = ?');
        values.push(slugify(data.name));
      }
    }
    if (data.slug !== undefined) { fields.push('`slug` = ?'); values.push(slugify(data.slug)); }
    if (data.description !== undefined) { fields.push('`description` = ?'); values.push(data.description); }
    if (data.image !== undefined) { fields.push('`image` = ?'); values.push(data.image); }
    if (data.status !== undefined) { fields.push('`status` = ?'); values.push(data.status); }

    if (fields.length > 0) {
      values.push(id);
      await query(`UPDATE \`categories\` SET ${fields.join(', ')} WHERE \`id\` = ?`, values);
    }
    return await this.findById(id);
  }

  static async delete(id) {
    await query('DELETE FROM `categories` WHERE `id` = ?', [id]);
    return true;
  }
}

module.exports = Category;
