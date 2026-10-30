const { query } = require('../config/db');

function parseJSON(val, fallback = {}) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

class Content {
  static async findByPage(page) {
    const rows = await query('SELECT * FROM `contents` WHERE `page` = ?', [page]);
    const faqs = await query("SELECT * FROM `faqs` WHERE `status` = 'active' ORDER BY `id` ASC");

    if (rows.length === 0) {
      return {
        page,
        title: 'Roshani Traders',
        description: 'Wholesale Three Wheeler Auto Parts & Decorative Accessories Specialist',
        faqs,
        contactInfo: {
          phone: '+91 98929 87454',
          email: 'sales@roshanitraders.com',
          address: 'Ajit Glass, Swami Vivekanand Rd, nr. Himalaya hotel, Behram Baug, Jogeshwari West, Mumbai, MH - 400102'
        }
      };
    }

    const mainRow = rows[0];
    const extraData = parseJSON(mainRow.data, {});

    return {
      id: mainRow.id,
      _id: String(mainRow.id),
      page: mainRow.page,
      section: mainRow.section,
      title: mainRow.title,
      description: mainRow.description,
      image: mainRow.image,
      ...extraData,
      faqs,
      createdAt: mainRow.created_at,
      updatedAt: mainRow.updated_at
    };
  }

  static async updateByPage(page, data) {
    const { title, description, image, section = 'main', ...rest } = data;
    const jsonStr = JSON.stringify(rest);

    await query(
      `INSERT INTO \`contents\` (\`page\`, \`section\`, \`title\`, \`description\`, \`image\`, \`data\`)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE \`title\` = VALUES(\`title\`), \`description\` = VALUES(\`description\`), \`image\` = VALUES(\`image\`), \`data\` = VALUES(\`data\`)`,
      [page, section, title || '', description || '', image || null, jsonStr]
    );

    return await this.findByPage(page);
  }

  static async findAll() {
    const rows = await query('SELECT * FROM `contents` ORDER BY `id` ASC');
    return rows.map(r => ({
      id: r.id,
      _id: String(r.id),
      page: r.page,
      section: r.section,
      title: r.title,
      description: r.description,
      image: r.image,
      ...parseJSON(r.data, {}),
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM `contents` WHERE `id` = ?', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      _id: String(r.id),
      page: r.page,
      section: r.section,
      title: r.title,
      description: r.description,
      image: r.image,
      ...parseJSON(r.data, {}),
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };
  }

  static async updateById(id, data) {
    const { title, description, image, section, page, ...rest } = data;
    const jsonStr = Object.keys(rest).length > 0 ? JSON.stringify(rest) : null;
    await query(
      `UPDATE \`contents\`
       SET \`title\` = COALESCE(?, \`title\`),
           \`description\` = COALESCE(?, \`description\`),
           \`image\` = COALESCE(?, \`image\`),
           \`section\` = COALESCE(?, \`section\`),
           \`page\` = COALESCE(?, \`page\`),
           \`data\` = COALESCE(?, \`data\`)
       WHERE \`id\` = ?`,
      [title, description, image, section, page, jsonStr, id]
    );
    return await this.findById(id);
  }

  static async getFaqs() {
    return await query("SELECT * FROM `faqs` WHERE `status` = 'active' ORDER BY `id` ASC");
  }

  static async addFaq(question, answer) {
    const res = await query('INSERT INTO `faqs` (`question`, `answer`, `status`) VALUES (?, ?, ?)', [question, answer, 'active']);
    return { id: res.insertId, question, answer, status: 'active' };
  }
}

module.exports = Content;
