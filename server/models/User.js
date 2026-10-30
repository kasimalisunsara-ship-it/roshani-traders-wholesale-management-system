const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: String(row.id),
    name: row.name,
    businessName: row.business_name,
    business_name: row.business_name,
    mobile: row.mobile,
    email: row.email,
    password: row.password,
    address: row.address,
    city: row.city,
    role: row.role,
    status: row.status,
    quoteCount: row.quote_count !== undefined ? Number(row.quote_count) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class User {
  static async matchPassword(enteredPassword, hashedPassword) {
    if (!enteredPassword || !hashedPassword) return false;
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async findByEmail(email) {
    const rows = await query('SELECT * FROM `users` WHERE `email` = ? LIMIT 1', [email.trim().toLowerCase()]);
    return formatUser(rows[0]);
  }

  static async findById(id) {
    const rows = await query('SELECT * FROM `users` WHERE `id` = ? LIMIT 1', [id]);
    return formatUser(rows[0]);
  }

  static async create(data) {
    const { name, businessName, business_name, mobile, email, password, address, city, role, status } = data;
    const finalBusinessName = businessName || business_name || 'Wholesale Buyer';
    const hashedPassword = await this.hashPassword(password || 'Customer@123456');

    const result = await query(
      `INSERT INTO \`users\` (\`name\`, \`business_name\`, \`mobile\`, \`email\`, \`password\`, \`address\`, \`city\`, \`role\`, \`status\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        finalBusinessName,
        mobile,
        email.trim().toLowerCase(),
        hashedPassword,
        address,
        city,
        role || 'customer',
        status || 'active'
      ]
    );

    return await this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('`name` = ?'); values.push(data.name); }
    if (data.businessName !== undefined || data.business_name !== undefined) {
      fields.push('`business_name` = ?');
      values.push(data.businessName || data.business_name);
    }
    if (data.mobile !== undefined) { fields.push('`mobile` = ?'); values.push(data.mobile); }
    if (data.address !== undefined) { fields.push('`address` = ?'); values.push(data.address); }
    if (data.city !== undefined) { fields.push('`city` = ?'); values.push(data.city); }
    if (data.role !== undefined) { fields.push('`role` = ?'); values.push(data.role); }
    if (data.status !== undefined) { fields.push('`status` = ?'); values.push(data.status); }
    if (data.password) {
      const hashed = await this.hashPassword(data.password);
      fields.push('`password` = ?');
      values.push(hashed);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    await query(`UPDATE \`users\` SET ${fields.join(', ')} WHERE \`id\` = ?`, values);
    return await this.findById(id);
  }

  static async updateStatus(id, status) {
    await query('UPDATE `users` SET `status` = ? WHERE `id` = ?', [status, id]);
    return await this.findById(id);
  }

  static async findAll(role = 'customer') {
    const sql = `
      SELECT u.*, COUNT(q.id) AS quote_count
      FROM \`users\` u
      LEFT JOIN \`quotes\` q ON q.user_id = u.id
      ${role ? 'WHERE u.role = ?' : ''}
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const rows = role ? await query(sql, [role]) : await query(sql);
    return rows.map(formatUser);
  }
}

module.exports = User;
