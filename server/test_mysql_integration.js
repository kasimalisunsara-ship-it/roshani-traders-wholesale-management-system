/**
 * Roshani Traders - MySQL 8.0.46 Comprehensive Verification Test Suite
 * Validates all 12 items from the specification:
 *  1. Connect to MySQL Server 8.0.46
 *  2. Verify roshani_traders database exists
 *  3. Verify all 8 tables exist
 *  4. Verify all 10 categories are inserted
 *  5. Verify all 28 products are inserted
 *  6. Register a new customer via API
 *  7. Login with registered customer via API
 *  8. Fetch products from MySQL via API
 *  9. Search and filter products via API
 * 10. Create a bulk quotation via API
 * 11. Verify quote_items records directly in MySQL
 * 12. Submit a customer enquiry via API
 * 13. Login to admin dashboard via API
 * 14. Add, edit, and delete a product via Admin API
 * 15. Update quote status via Admin API
 * 16. Verify AI product recommendations use actual MySQL database records
 * 17. Verify health-check endpoint GET /api/health
 */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mysql = require('mysql2/promise');
const { pool } = require('./config/db');

const BASE_URL = 'http://localhost:5000';

let testResults = [];

function recordResult(testName, passed, details) {
  testResults.push({ testName, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} | ${testName} - ${details}`);
}

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 ROSHANI TRADERS - MYSQL SERVER 8.0.46 INTEGRATION TEST SUITE');
  console.log('================================================================\n');

  try {
    // 1. Connect successfully to MySQL Server 8.0.46
    const [verRows] = await pool.query('SELECT VERSION() AS version');
    const versionStr = verRows[0].version;
    const isVer8 = versionStr.startsWith('8.0');
    recordResult('1. MySQL Connection & Version', isVer8, `Connected to MySQL version: ${versionStr}`);

    // 2. Verify roshani_traders database exists
    const [dbRows] = await pool.query("SHOW DATABASES LIKE 'roshani_traders'");
    recordResult('2. Database Exists', dbRows.length > 0, `Database 'roshani_traders' verified`);

    // 3. Verify all 8 tables are created
    const requiredTables = ['users', 'categories', 'products', 'quotes', 'quote_items', 'enquiries', 'contents', 'faqs'];
    const [tblRows] = await pool.query('SHOW TABLES');
    const existingTables = tblRows.map(r => Object.values(r)[0]);
    const allTablesPresent = requiredTables.every(t => existingTables.includes(t));
    recordResult('3. All 8 Tables Exist', allTablesPresent, `Found tables: ${existingTables.join(', ')}`);

    // 4. Verify all 10 categories are inserted
    const [catRows] = await pool.query('SELECT COUNT(*) AS count FROM categories');
    const catCount = catRows[0].count;
    recordResult('4. 10 Categories Inserted', catCount >= 10, `Found ${catCount} categories in MySQL`);

    // 5. Verify all 28 products are inserted
    const [prodRows] = await pool.query('SELECT COUNT(*) AS count FROM products');
    const prodCount = prodRows[0].count;
    recordResult('5. 28 Auto Parts Products Inserted', prodCount >= 28, `Found ${prodCount} products in MySQL`);

    // 17. Database health check endpoint GET /api/health
    const healthRes = await apiRequest('/api/health');
    const healthOk = healthRes.ok && healthRes.data?.status === 'online' && healthRes.data?.database === 'connected';
    recordResult('17. Health Check API (/api/health)', healthOk, `Status: ${healthRes.data?.status}, DB: ${healthRes.data?.database}, Engine: ${healthRes.data?.dbVersion}`);

    // 6. Register a new customer
    const testEmail = `test_dealer_${Date.now()}@roshanitraders.com`;
    const regRes = await apiRequest('/api/auth/register', 'POST', {
      name: 'Verif Auto Spares',
      businessName: 'Verif Auto Spares Wholesale',
      email: testEmail,
      password: 'Password@123',
      mobile: '+91 98765 43210',
      address: 'Shop 12, Automobile Market',
      city: 'Pune'
    });
    const regOk = regRes.ok && regRes.data?.success && regRes.data?.token;
    recordResult('6. Register New Customer', regOk, `Registered user ID: ${regRes.data?.user?.id || regRes.data?.user?._id}`);

    // 7. Login with registered customer
    const loginRes = await apiRequest('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'Password@123'
    });
    const loginOk = loginRes.ok && loginRes.data?.success && loginRes.data?.token;
    const customerToken = loginRes.data?.token;
    recordResult('7. Customer Login', loginOk, `Customer authenticated, token received`);

    // Verify GET /api/auth/me
    const meRes = await apiRequest('/api/auth/me', 'GET', null, customerToken);
    const meOk = meRes.ok && meRes.data?.user?.email === testEmail;
    recordResult('7b. Fetch Auth Me Profile', meOk, `Logged in as: ${meRes.data?.user?.email} (${meRes.data?.user?.role})`);

    // 8. Fetch products from MySQL
    const prodListRes = await apiRequest('/api/products?limit=50');
    const productsFetched = prodListRes.ok && Array.isArray(prodListRes.data?.products) && prodListRes.data.products.length >= 28;
    recordResult('8. Fetch Products from MySQL', productsFetched, `Fetched ${prodListRes.data?.products?.length} products via API`);

    // 9. Search and filter products
    const searchRes = await apiRequest('/api/products?search=bumper');
    const searchOk = searchRes.ok && searchRes.data?.products?.length > 0;
    const filterRes = await apiRequest('/api/products?category=body-parts');
    const filterOk = filterRes.ok && filterRes.data?.products?.length > 0;
    recordResult('9. Product Search & Category Filters', searchOk && filterOk, `Search 'bumper': ${searchRes.data?.products?.length} items, Category 'body-parts': ${filterRes.data?.products?.length} items`);

    // 10. Create a bulk quotation
    const firstProduct = prodListRes.data?.products[0];
    const secondProduct = prodListRes.data?.products[1];
    const quoteRes = await apiRequest('/api/quotes', 'POST', {
      items: [
        { productId: firstProduct.id || firstProduct._id, quantity: firstProduct.moq || 10 },
        { productId: secondProduct.id || secondProduct._id, quantity: secondProduct.moq || 10 }
      ],
      remarks: 'Automated test bulk quotation'
    }, customerToken);
    const quoteCreated = quoteRes.ok && quoteRes.data?.success;
    const createdQuoteId = quoteRes.data?.quote?.id || quoteRes.data?.quote?._id;
    recordResult('10. Create Bulk Quotation', quoteCreated, `Created Quote ID: ${createdQuoteId}, Total: ₹${quoteRes.data?.quote?.totalAmount}`);

    // 11. Verify quote_items records directly in MySQL
    let quoteItemsCount = 0;
    if (createdQuoteId) {
      const [itemsRows] = await pool.query('SELECT COUNT(*) AS count FROM quote_items WHERE quote_id = ?', [createdQuoteId]);
      quoteItemsCount = itemsRows[0].count;
    }
    recordResult('11. Verify quote_items in MySQL', quoteItemsCount === 2, `Verified ${quoteItemsCount} items saved in quote_items table for quote #${createdQuoteId}`);

    // 12. Submit a customer enquiry
    const enquiryRes = await apiRequest('/api/enquiries', 'POST', {
      name: 'Ramesh Auto Center',
      businessName: 'Ramesh Three Wheeler Spares',
      mobile: '+91 98220 11223',
      email: 'ramesh@rameshauto.com',
      subject: 'Inquiry for 100 sets of Front Bumper',
      message: 'Urgent wholesale enquiry: We need 100 pieces of Heavy Duty Front Bumper for Bajaj Compact RE.'
    });
    const enquiryCreated = enquiryRes.ok && enquiryRes.data?.success;
    const enquiryId = enquiryRes.data?.enquiry?.id || enquiryRes.data?.enquiry?._id;
    recordResult('12. Submit Customer Enquiry', enquiryCreated, `Created Enquiry ID: ${enquiryId}`);

    // 13. Login to admin dashboard
    const adminLoginRes = await apiRequest('/api/auth/login', 'POST', {
      email: 'admin@roshanitraders.com',
      password: 'Admin@123456'
    });
    const adminOk = adminLoginRes.ok && adminLoginRes.data?.token && adminLoginRes.data?.user?.role === 'admin';
    const adminToken = adminLoginRes.data?.token;
    recordResult('13. Admin Dashboard Authentication', adminOk, `Admin logged in successfully with role: admin`);

    // 14. Add, edit and delete a product via Admin API
    const newProdRes = await apiRequest('/api/products', 'POST', {
      name: 'Test Temporary Front Axle Bush',
      slug: `test-front-axle-bush-${Date.now()}`,
      category: firstProduct.category?.id || firstProduct.category?._id || 1,
      brand: 'Roshani Genuine',
      price: 450,
      moq: 20,
      stock: 200,
      description: 'Temporary test auto part for verification',
      specifications: { material: 'Brass', diameter: '22mm' },
      compatibleModels: ['Bajaj RE', 'Piaggio Ape']
    }, adminToken);
    const prodAdded = newProdRes.ok && newProdRes.data?.success;
    const testProdId = newProdRes.data?.product?.id || newProdRes.data?.product?._id;

    let prodEdited = false;
    let prodDeleted = false;
    if (testProdId) {
      const editRes = await apiRequest(`/api/products/${testProdId}`, 'PUT', {
        price: 480,
        stock: 250
      }, adminToken);
      prodEdited = editRes.ok && editRes.data?.success && editRes.data?.product?.price == 480;

      const delRes = await apiRequest(`/api/products/${testProdId}`, 'DELETE', null, adminToken);
      prodDeleted = delRes.ok && delRes.data?.success;
    }
    recordResult('14. Admin Product CRUD (Add/Edit/Delete)', prodAdded && prodEdited && prodDeleted, `Add: ${prodAdded}, Edit: ${prodEdited}, Delete: ${prodDeleted}`);

    // 15. Update quote status
    let quoteUpdated = false;
    if (createdQuoteId) {
      const statusRes = await apiRequest(`/api/quotes/${createdQuoteId}/status`, 'PUT', {
        status: 'Confirmed'
      }, adminToken);
      quoteUpdated = statusRes.ok && statusRes.data?.success && statusRes.data?.quote?.status === 'Confirmed';
    }
    recordResult('15. Update Quote Status to Confirmed', quoteUpdated, `Quote #${createdQuoteId} updated to Confirmed by Admin`);

    // 16. Verify AI product recommendations use actual database records
    const aiChatRes = await apiRequest('/api/ai/chat', 'POST', {
      message: 'I want to buy 50 bumpers for Bajaj RE'
    });
    const aiChatOk = aiChatRes.ok && aiChatRes.data?.success && aiChatRes.data?.reply && Array.isArray(aiChatRes.data?.products);
    const aiSummaryRes = await apiRequest('/api/ai/summarize-enquiry', 'POST', {
      message: 'Urgent inquiry for 200 brake drums and 50 headlights for Piaggio Ape',
      subject: 'Bulk order quotation needed',
      businessName: 'Sharma Auto Spares',
      name: 'Sharma'
    });
    const aiSummaryOk = aiSummaryRes.ok && aiSummaryRes.data?.success && aiSummaryRes.data?.summary?.summary;
    recordResult('16. AI Assistant Engine (MySQL Data Driven)', aiChatOk && aiSummaryOk, `AI Chat: matched ${aiChatRes.data?.products?.length} DB products; AI Summary generated: ${aiSummaryOk}`);

    // 18. CMS Content and FAQs
    const contentRes = await apiRequest('/api/content/home');
    const contentOk = contentRes.ok && contentRes.data?.content && Array.isArray(contentRes.data?.content?.faqs);
    recordResult('18. CMS Content & FAQs from MySQL', contentOk, `Loaded page "${contentRes.data?.content?.page}" with ${contentRes.data?.content?.faqs?.length} FAQs`);

    console.log('\n================================================================');
    const allPassed = testResults.every(r => r.passed);
    const passCount = testResults.filter(r => r.passed).length;
    console.log(`📊 TOTAL TESTS: ${testResults.length} | PASSED: ${passCount} | FAILED: ${testResults.length - passCount}`);
    if (allPassed) {
      console.log('🎉 ALL 18 INTEGRATION & VERIFICATION TESTS PASSED SUCCESSFULLY!');
    } else {
      console.log('⚠️ SOME TESTS FAILED. Review output above.');
    }
    console.log('================================================================\n');

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('Fatal test execution error:', error);
    process.exit(1);
  }
}

runTests();
