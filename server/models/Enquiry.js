const { query } = require('../config/db');

function parseJSON(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function formatEnquiry(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: String(row.id),
    userId: row.user_id,
    name: row.name,
    businessName: row.business_name,
    mobile: row.mobile,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    aiSummary: parseJSON(row.ai_summary, null),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class Enquiry {
  static async create(data) {
    const { userId, user, name, businessName, mobile, email, subject, message } = data;
    const finalUserId = userId || (user ? (user._id || user.id) : null);

    const result = await query(
      `INSERT INTO \`enquiries\` (\`user_id\`, \`name\`, \`business_name\`, \`mobile\`, \`email\`, \`subject\`, \`message\`, \`status\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New')`,
      [finalUserId, name, businessName, mobile, email, subject, message]
    );

    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM `enquiries` WHERE `id` = ? LIMIT 1', [id]);
    return formatEnquiry(rows[0]);
  }

  static async findAll(statusFilter = null) {
    let sql = 'SELECT * FROM `enquiries`';
    const params = [];
    if (statusFilter) {
      sql += ' WHERE `status` = ?';
      params.push(statusFilter);
    }
    sql += ' ORDER BY `created_at` DESC';
    const rows = await query(sql, params);
    return rows.map(formatEnquiry);
  }

  static async updateStatus(id, status) {
    await query('UPDATE `enquiries` SET `status` = ? WHERE `id` = ?', [status, id]);
    return await this.findById(id);
  }

  static async updateAiSummary(id, summary) {
    const jsonStr = JSON.stringify(summary);
    await query('UPDATE `enquiries` SET `ai_summary` = ? WHERE `id` = ?', [jsonStr, id]);
    return await this.findById(id);
  }

  static async delete(id) {
    await query('DELETE FROM `enquiries` WHERE `id` = ?', [id]);
    return true;
  }
}

module.exports = Enquiry;
