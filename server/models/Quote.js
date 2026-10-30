const { query, getTransaction } = require('../config/db');

function parseJSON(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function formatQuote(q, items = []) {
  if (!q) return null;

  return {
    id: q.id,
    _id: String(q.id),
    quoteId: q.quote_id || `RT-Q${String(q.id).padStart(5, '0')}`,
    userId: q.user_id,
    user: q.user_id ? {
      id: q.user_id,
      _id: String(q.user_id),
      name: q.user_name || '',
      businessName: q.user_business_name || '',
      email: q.user_email || '',
      mobile: q.user_mobile || '',
      address: q.user_address || '',
      city: q.user_city || ''
    } : null,
    total_amount: Number(q.total_amount || 0),
    totalAmount: Number(q.total_amount || 0),
    estimatedAmount: Number(q.total_amount || 0),
    remarks: q.remarks || '',
    status: q.status || 'Pending',
    trackingStatus: q.tracking_status || 'Order Placed',
    trackingNumber: q.tracking_number || `TRK-${q.id}-${Date.now().toString().slice(-4)}`,
    currentLocation: q.current_location || 'Roshani Central Wholesale Hub, Bhiwandi, MH',
    trackingHistory: parseJSON(q.tracking_history, [
      {
        status: 'Order Placed',
        location: 'Roshani Online B2B Portal',
        timestamp: q.created_at,
        comment: 'Wholesale order registered and submitted for admin review.'
      }
    ]),
    products: items.map(item => ({
      id: item.id,
      _id: String(item.id),
      product: {
        id: item.product_id,
        _id: String(item.product_id),
        name: item.product_name || '',
        price: Number(item.price_at_quote || 0),
        image: item.product_image || '/images/products/mudguard-set.webp'
      },
      productName: item.product_name,
      quantity: Number(item.quantity || 1),
      price: Number(item.price_at_quote || 0),
      priceAtQuote: Number(item.price_at_quote || 0),
      subtotal: Number(item.subtotal || 0),
      estimatedTotal: Number(item.subtotal || 0)
    })),
    createdAt: q.created_at,
    updatedAt: q.updated_at
  };
}

class Quote {
  static async create(quoteData, items = []) {
    const conn = await getTransaction();
    try {
      const {
        userId,
        totalAmount,
        remarks,
        status = 'Pending',
        trackingStatus = 'Order Placed',
        currentLocation = 'Roshani Central Wholesale Hub, Bhiwandi, MH'
      } = quoteData;

      const trackingNumber = `TRK-${Date.now().toString().slice(-6)}`;
      const initialHistory = JSON.stringify([
        {
          status: 'Order Placed',
          location: 'Roshani B2B Portal',
          timestamp: new Date().toISOString(),
          comment: 'Wholesale quotation request created.'
        }
      ]);

      const [res] = await conn.query(
        `INSERT INTO \`quotes\` (\`user_id\`, \`total_amount\`, \`remarks\`, \`status\`, \`tracking_status\`, \`tracking_number\`, \`current_location\`, \`tracking_history\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, totalAmount, remarks, status, trackingStatus, trackingNumber, currentLocation, initialHistory]
      );

      const quoteId = res.insertId;
      const formattedQuoteCode = `RT-Q${String(quoteId).padStart(5, '0')}`;
      await conn.query('UPDATE `quotes` SET `quote_id` = ? WHERE `id` = ?', [formattedQuoteCode, quoteId]);

      // Insert all quote_items
      for (const item of items) {
        await conn.query(
          `INSERT INTO \`quote_items\` (\`quote_id\`, \`product_id\`, \`quantity\`, \`price_at_quote\`, \`subtotal\`)
           VALUES (?, ?, ?, ?, ?)`,
          [quoteId, item.productId, item.quantity, item.price, item.subtotal]
        );
      }

      await conn.commit();
      conn.release();
      return await this.findById(quoteId);
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  }

  static async findById(id) {
    const quoteSql = `
      SELECT q.*, u.name AS user_name, u.business_name AS user_business_name,
             u.email AS user_email, u.mobile AS user_mobile, u.city AS user_city, u.address AS user_address
      FROM \`quotes\` q
      LEFT JOIN \`users\` u ON u.id = q.user_id
      WHERE q.id = ?
      LIMIT 1
    `;
    const quoteRows = await query(quoteSql, [id]);
    if (quoteRows.length === 0) return null;

    const itemsSql = `
      SELECT qi.*, p.name AS product_name, p.image AS product_image
      FROM \`quote_items\` qi
      LEFT JOIN \`products\` p ON p.id = qi.product_id
      WHERE qi.quote_id = ?
    `;
    const itemRows = await query(itemsSql, [id]);
    return formatQuote(quoteRows[0], itemRows);
  }

  static async findAll() {
    const quotesSql = `
      SELECT q.*, u.name AS user_name, u.business_name AS user_business_name,
             u.email AS user_email, u.mobile AS user_mobile, u.city AS user_city, u.address AS user_address
      FROM \`quotes\` q
      LEFT JOIN \`users\` u ON u.id = q.user_id
      ORDER BY q.created_at DESC
    `;
    const quotes = await query(quotesSql);
    if (quotes.length === 0) return [];

    const itemsSql = `
      SELECT qi.*, p.name AS product_name, p.image AS product_image
      FROM \`quote_items\` qi
      LEFT JOIN \`products\` p ON p.id = qi.product_id
    `;
    const allItems = await query(itemsSql);
    const itemMap = {};
    allItems.forEach(i => {
      if (!itemMap[i.quote_id]) itemMap[i.quote_id] = [];
      itemMap[i.quote_id].push(i);
    });

    return quotes.map(q => formatQuote(q, itemMap[q.id] || []));
  }

  static async findByUserId(userId) {
    const quotesSql = `
      SELECT q.*, u.name AS user_name, u.business_name AS user_business_name,
             u.email AS user_email, u.mobile AS user_mobile, u.city AS user_city, u.address AS user_address
      FROM \`quotes\` q
      LEFT JOIN \`users\` u ON u.id = q.user_id
      WHERE q.user_id = ?
      ORDER BY q.created_at DESC
    `;
    const quotes = await query(quotesSql, [userId]);
    if (quotes.length === 0) return [];

    const quoteIds = quotes.map(q => q.id);
    const itemsSql = `
      SELECT qi.*, p.name AS product_name, p.image AS product_image
      FROM \`quote_items\` qi
      LEFT JOIN \`products\` p ON p.id = qi.product_id
      WHERE qi.quote_id IN (${quoteIds.map(() => '?').join(',')})
    `;
    const allItems = await query(itemsSql, quoteIds);
    const itemMap = {};
    allItems.forEach(i => {
      if (!itemMap[i.quote_id]) itemMap[i.quote_id] = [];
      itemMap[i.quote_id].push(i);
    });

    return quotes.map(q => formatQuote(q, itemMap[q.id] || []));
  }

  static async findByCode(code) {
    const clean = String(code).trim();
    const quoteSql = `
      SELECT q.*, u.name AS user_name, u.business_name AS user_business_name,
             u.email AS user_email, u.mobile AS user_mobile, u.city AS user_city, u.address AS user_address
      FROM \`quotes\` q
      LEFT JOIN \`users\` u ON u.id = q.user_id
      WHERE q.quote_id = ? OR q.tracking_number = ? OR q.id = ?
      LIMIT 1
    `;
    const quoteRows = await query(quoteSql, [clean, clean, isNaN(clean) ? -1 : parseInt(clean, 10)]);
    if (quoteRows.length === 0) return null;

    const itemsSql = `
      SELECT qi.*, p.name AS product_name, p.image AS product_image
      FROM \`quote_items\` qi
      LEFT JOIN \`products\` p ON p.id = qi.product_id
      WHERE qi.quote_id = ?
    `;
    const itemRows = await query(itemsSql, [quoteRows[0].id]);
    return formatQuote(quoteRows[0], itemRows);
  }

  static async updateStatus(id, status, comment = null) {
    const existing = await this.findById(id);
    if (!existing) return null;

    let trackingStatus = existing.trackingStatus;
    if (status === 'Confirmed') trackingStatus = 'Packed';
    else if (status === 'Processing') trackingStatus = 'Processing';
    else if (status === 'Completed') trackingStatus = 'Delivered';

    const history = existing.trackingHistory || [];
    history.push({
      status: trackingStatus || status,
      location: existing.currentLocation || 'Roshani Central Hub, Bhiwandi, MH',
      timestamp: new Date().toISOString(),
      comment: comment || `Status updated to ${status}`
    });

    await query(
      'UPDATE `quotes` SET `status` = ?, `tracking_status` = ?, `tracking_history` = ? WHERE `id` = ?',
      [status, trackingStatus, JSON.stringify(history), id]
    );

    return await this.findById(id);
  }

  static async updateTracking(id, { trackingStatus, currentLocation, comment, trackingNumber }) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const history = existing.trackingHistory || [];
    history.push({
      status: trackingStatus || existing.trackingStatus || 'In Transit',
      location: currentLocation || existing.currentLocation || 'Transit Godown',
      timestamp: new Date().toISOString(),
      comment: comment || 'Tracking update logged'
    });

    await query(
      `UPDATE \`quotes\`
       SET \`tracking_status\` = COALESCE(?, \`tracking_status\`),
           \`current_location\` = COALESCE(?, \`current_location\`),
           \`tracking_number\` = COALESCE(?, \`tracking_number\`),
           \`tracking_history\` = ?
       WHERE \`id\` = ?`,
      [trackingStatus || null, currentLocation || null, trackingNumber || null, JSON.stringify(history), id]
    );

    return await this.findById(id);
  }
}

module.exports = Quote;
