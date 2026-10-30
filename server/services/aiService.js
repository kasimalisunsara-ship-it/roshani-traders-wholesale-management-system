const Product = require('../models/Product');
const Category = require('../models/Category');
const { query } = require('../config/db');

/**
 * Intelligent Catalogue AI Engine for Roshani Traders (MySQL 8.0.46)
 */
class AIService {
  /**
   * Main conversational handler for customer queries
   */
  static async processChat(message, userContext = {}) {
    const msg = message.toLowerCase().trim();

    // 1. Check for quotation creation intent (e.g. "I need 50 bumpers and 100 side mirrors")
    const quotePattern = /(\d+)\s+([a-zA-Z0-9\s]+?)(?:and|\,|$)/g;
    let matches = [];
    let match;
    while ((match = quotePattern.exec(msg)) !== null) {
      const qty = parseInt(match[1], 10);
      const itemText = match[2].trim();
      if (qty > 0 && itemText.length > 2 && !['items', 'parts', 'wheelers', 'rupees', 'rs'].includes(itemText)) {
        matches.push({ qty, itemText });
      }
    }

    if (matches.length > 0 && (msg.includes('need') || msg.includes('want') || msg.includes('buy') || msg.includes('quote') || msg.includes('order'))) {
      return await this.handleQuoteAssistant(matches);
    }

    // 2. Budget constraints (e.g. "under ₹1000", "less than 500")
    let maxPrice = null;
    const priceMatch = msg.match(/(?:under|less than|below|within|<=|₹|rs\.?)\s*(\d+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    // 3. Specific vehicle model query (e.g. Bajaj RE, Piaggio Ape, TVS King, Mahindra Alfa)
    let targetModel = null;
    if (msg.includes('bajaj')) targetModel = 'Bajaj RE';
    else if (msg.includes('piaggio') || msg.includes('ape')) targetModel = 'Piaggio Ape';
    else if (msg.includes('tvs')) targetModel = 'TVS King';
    else if (msg.includes('mahindra') || msg.includes('alfa')) targetModel = 'Mahindra Alfa';

    // 4. MOQ or Stock query
    if (msg.includes('moq') || msg.includes('minimum order') || msg.includes('stock') || msg.includes('available')) {
      return await this.handleMOQStockQuery(msg, targetModel);
    }

    // 5. Alternatives query
    if (msg.includes('alternative') || msg.includes('similar') || msg.includes('substitute') || msg.includes('unavailable')) {
      return await this.handleAlternativesQuery(msg);
    }

    // 6. General product search / natural language query
    return await this.handleProductSearch(msg, maxPrice, targetModel);
  }

  /**
   * Natural Language Product Search using MySQL
   */
  static async handleProductSearch(msg, maxPrice, targetModel) {
    const keywords = msg
      .replace(/show|me|find|get|parts|for|three|wheeler|wheelers|i|need|want|give|under|rs|₹|\d+/gi, '')
      .trim();

    const searchOptions = {
      search: keywords.length >= 2 ? keywords : null,
      maxPrice: maxPrice || null,
      model: targetModel || null,
      limit: 6
    };

    let result = await Product.findAll(searchOptions);
    let products = result.products;

    if (products.length === 0 && targetModel) {
      result = await Product.findAll({ model: targetModel, maxPrice, limit: 6 });
      products = result.products;
    }

    if (products.length === 0 && !keywords) {
      result = await Product.findAll({ limit: 4 });
      products = result.products;
    }

    if (products.length === 0) {
      return {
        reply: `I could not find matching products in the Roshani Traders catalogue for your search criteria. Please try searching by product name (e.g. Bumper, Side Mirror, Brake Shoe, Cylinder Kit) or vehicle model (Bajaj RE, Piaggio Ape, TVS King).`,
        products: [],
        type: 'text'
      };
    }

    let reply = `I found ${products.length} product${products.length > 1 ? 's' : ''} available in our wholesale catalogue:`;
    if (targetModel) reply += ` for vehicle model **${targetModel}**`;
    if (maxPrice) reply += ` under **₹${maxPrice}**`;

    return {
      reply,
      products: products.map(p => ({
        id: p.id,
        _id: p._id,
        name: p.name,
        category: p.category ? p.category.name : 'General Parts',
        brand: p.brand,
        price: p.price,
        moq: p.moq,
        MOQ: p.moq,
        stock: p.stock,
        available: p.availability && p.stock > 0,
        image: p.image
      })),
      type: 'product_recommendations'
    };
  }

  /**
   * Natural Language Quotation Assistant
   */
  static async handleQuoteAssistant(itemsRequest) {
    let quoteItems = [];
    let totalEstimated = 0;

    for (let req of itemsRequest) {
      let cleanSearch = req.itemText.replace(/\b(for|bajaj|re|piaggio|ape|tvs|king|mahindra|alfa|pieces|pcs|units|sets|wheelers|three)\b/gi, '').trim();
      if (!cleanSearch) cleanSearch = req.itemText;
      // Singularize word (e.g. bumpers -> bumper, mirrors -> mirror)
      const singularSearch = cleanSearch.replace(/s\b/gi, '').trim();

      let searchRes = await Product.findAll({ search: singularSearch || cleanSearch, limit: 1 });
      if (searchRes.products.length === 0) {
        searchRes = await Product.findAll({ search: cleanSearch, limit: 1 });
      }
      const product = searchRes.products[0];

      if (product) {
        const effectiveQty = Math.max(req.qty, product.moq);
        const subtotal = Number((effectiveQty * product.price).toFixed(2));
        totalEstimated += subtotal;
        quoteItems.push({
          product: product.id,
          _id: product._id,
          productId: product.id,
          productName: product.name,
          requestedQty: req.qty,
          effectiveQty,
          moq: product.moq,
          price: product.price,
          subtotal,
          image: product.image,
          availability: product.availability && product.stock > 0
        });
      }
    }

    if (quoteItems.length === 0) {
      return {
        reply: `I could not find matching products in our current catalogue for your quote request. Please try specifying items like "50 bumpers" or "100 side mirrors".`,
        products: [],
        type: 'text'
      };
    }

    let reply = `Here is your estimated bulk quotation summary based on live Roshani Traders catalogue prices:\n\n`;
    quoteItems.forEach(item => {
      reply += `• **${item.productName}**: ${item.effectiveQty} units @ ₹${item.price}/unit = **₹${item.subtotal.toLocaleString()}** (MOQ: ${item.moq})\n`;
      if (item.requestedQty < item.moq) {
        reply += `  ⚠️ *Adjusted quantity from ${item.requestedQty} to meet MOQ requirement of ${item.moq}*\n`;
      }
    });

    reply += `\n**Estimated Total Amount: ₹${totalEstimated.toLocaleString()}**\n\nWould you like to load these products into your official Quotation Request form?`;

    return {
      reply,
      quoteDraft: {
        items: quoteItems,
        totalEstimated
      },
      products: quoteItems.map(qi => ({
        id: qi.product,
        _id: qi._id,
        name: qi.productName,
        price: qi.price,
        moq: qi.moq,
        MOQ: qi.moq,
        qty: qi.effectiveQty,
        image: qi.image,
        available: qi.availability
      })),
      type: 'quote_assistant'
    };
  }

  /**
   * MOQ and Stock queries
   */
  static async handleMOQStockQuery(msg, targetModel) {
    const keywords = msg.replace(/moq|minimum|order|quantity|stock|available|what|is|the|of|for|in/gi, '').trim();

    let product = null;
    if (keywords.length >= 2) {
      const res = await Product.findAll({ search: keywords, limit: 1 });
      product = res.products[0];
    }

    if (!product && targetModel) {
      const res = await Product.findAll({ model: targetModel, limit: 1 });
      product = res.products[0];
    }

    if (!product) {
      const res = await Product.findAll({ limit: 1 });
      product = res.products[0];
    }

    if (!product) {
      return {
        reply: `I could not find this information in the current Roshani Traders catalogue.`,
        type: 'text'
      };
    }

    return {
      reply: `For **${product.name}** (${product.brand}):\n• Wholesale Price: **₹${product.price}**\n• Minimum Order Quantity (MOQ): **${product.moq} units**\n• Current Wholesale Stock: **${product.stock} units** (${product.availability && product.stock > 0 ? 'In Stock' : 'Out of Stock'})`,
      products: [{
        id: product.id,
        _id: product._id,
        name: product.name,
        category: product.category ? product.category.name : 'General',
        brand: product.brand,
        price: product.price,
        moq: product.moq,
        MOQ: product.moq,
        stock: product.stock,
        available: product.availability && product.stock > 0,
        image: product.image
      }],
      type: 'product_recommendations'
    };
  }

  /**
   * Recommendations for alternatives
   */
  static async handleAlternativesQuery(msg) {
    const res = await Product.findAll({ availability: 'true', limit: 4 });
    const products = res.products;

    return {
      reply: `Here are available wholesale alternatives currently in stock at Roshani Traders:`,
      products: products.map(p => ({
        id: p.id,
        _id: p._id,
        name: p.name,
        category: p.category ? p.category.name : 'General',
        brand: p.brand,
        price: p.price,
        moq: p.moq,
        MOQ: p.moq,
        stock: p.stock,
        available: true,
        image: p.image
      })),
      type: 'product_recommendations'
    };
  }

  /**
   * AI Summarizer for Admin Enquiries
   */
  static async summarizeEnquiry(enquiry) {
    const text = (enquiry.subject + ' ' + enquiry.message).toLowerCase();


    // Determine priority based on urgency keywords
    let priority = 'Medium';
    if (text.includes('urgent') || text.includes('immediate') || text.includes('asap') || text.includes('bulk order') || text.includes('500') || text.includes('1000')) {
      priority = 'High';
    } else if (text.includes('general') || text.includes('info') || text.includes('catalog')) {
      priority = 'Low';
    }

    // Extract potential product mentions
    let requestedItems = [];
    const knownProducts = [
      'bumper', 'side mirror', 'brake shoe', 'brake drum', 'headlight', 'tail light',
      'clutch plate', 'air filter', 'indicator', 'suspension', 'grill', 'seat cover',
      'stop mono', 'dera patty', 'inco', 'majgad', 'mudguard', 'morris', 'spoiler',
      'dashboard', 'cylinder', 'piston', 'carburetor', 'wiper', 'speedometer'
    ];
    knownProducts.forEach(item => {
      if (text.includes(item)) {
        requestedItems.push(item.charAt(0).toUpperCase() + item.slice(1));
      }
    });
    if (requestedItems.length === 0) requestedItems.push('Wholesale Catalogue & Pricing');

    // Extract quantity pattern
    const qtyMatch = text.match(/(\d+)\s*(pcs|pieces|units|set|sets|nos)?/i);
    const quantity = qtyMatch ? `${qtyMatch[1]} units requested` : 'Quantity not specified (Bulk Inquiry)';

    // Suggested response points for admin
    const suggestedResponsePoints = [
      `Confirm availability and stock status for requested products (${requestedItems.join(', ')}).`,
      `Provide tier-1 wholesale pricing quote and volume discount options for ${quantity}.`,
      `Offer shipping estimated timeline to customer location: ${enquiry.businessName} (${enquiry.email}).`,
      `Encourage customer to formalize order via the Roshani Traders Bulk Quote system.`
    ];

    const summary = `Customer from "${enquiry.businessName}" is enquiring regarding ${requestedItems.join(', ')}. Intent: Wholesale rate & availability.`;

    return {
      summary,
      requestedItems,
      quantity,
      priority,
      suggestedResponsePoints
    };
  }

  static async generateEnquirySummary(enquiry) {
    return this.summarizeEnquiry(enquiry);
  }
}

module.exports = AIService;
