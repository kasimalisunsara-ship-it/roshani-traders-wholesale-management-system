const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');
const PDF_PATH = 'c:/Users/Hamza Jutt/OneDrive/Desktop/Roshani-Traders/Roshani_Traders_Modules_Documentation.pdf';
const ARTIFACT_PDF_PATH = 'C:/Users/Hamza Jutt/.gemini/antigravity-ide/brain/3d59b6e5-ff33-4b5d-9ffa-2a50ebb43754/Roshani_Traders_Modules_Documentation.pdf';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const parsedUrl = new URL(url);
    const req = http.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('Fetching sample product for Product Details page...');
  let productId = '1';
  try {
    const productsRes = await fetchJson(`${API_URL}/products`);
    const products = productsRes.products || productsRes;
    if (products && products.length > 0) {
      productId = products[0]._id;
    }
  } catch (err) {
    console.warn('Could not fetch product ID, fallback to 1:', err.message);
  }

  console.log('Authenticating Customer and Admin users via API...');
  let customerToken = '';
  let customerUser = null;
  let adminToken = '';
  let adminUser = null;

  try {
    const custRes = await postJson(`${API_URL}/auth/login`, {
      email: 'customer@autocenter.com',
      password: 'Customer@123456'
    });
    if (custRes.token) {
      customerToken = custRes.token;
      customerUser = custRes.user || custRes;
    }
  } catch (e) {
    console.error('Customer login failed:', e.message);
  }

  try {
    const admRes = await postJson(`${API_URL}/auth/login`, {
      email: 'admin@roshanitraders.com',
      password: 'Admin@123456'
    });
    if (admRes.token) {
      adminToken = admRes.token;
      adminUser = admRes.user || admRes;
    }
  } catch (e) {
    console.error('Admin login failed:', e.message);
  }

  console.log('Detecting browser executable path...');
  const possiblePaths = [
    'C:\\Users\\Hamza Jutt\\.cache\\puppeteer\\chrome\\win64-152.0.7977.75\\chrome-win64\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  let executablePath = possiblePaths.find(p => fs.existsSync(p));
  if (executablePath) {
    console.log('Using browser executable at:', executablePath);
  }

  console.log('Launching Puppeteer browser...');
  const launchOptions = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };
  if (executablePath) launchOptions.executablePath = executablePath;

  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const modules = [
    {
      num: 1,
      title: 'Home Page',
      route: '/',
      authRole: 'none',
      description: 'The Home Page is the main entry point of the Roshani Traders website. It provides a brief introduction to the company and highlights that the business deals in wholesale three-wheeler auto parts and accessories. The page displays a navigation menu, company information, product categories, selected or featured products, product images, wholesale information, and contact/enquiry options. It also provides quick navigation to the Products, Categories, Login, Contact and other important sections of the website.'
    },
    {
      num: 2,
      title: 'About Us Page',
      route: '/about',
      authRole: 'none',
      description: 'The About Us Page provides information about Roshani Traders, its business background, wholesale trading activities, and the types of three-wheeler auto parts and decorative accessories supplied by the company. The page helps customers understand the nature of the business and its focus on wholesale customers. It can also contain information about the company\'s services, product quality, business approach, and customer support.'
    },
    {
      num: 3,
      title: 'Products Page',
      route: '/products',
      authRole: 'none',
      description: 'The Products Page displays the complete catalogue of three-wheeler auto parts and accessories available through Roshani Traders. Products are displayed using product cards containing important information such as product name, category, image, wholesale price, MOQ, brand, and availability status. Customers can select a particular product to view its detailed information before submitting a wholesale enquiry.'
    },
    {
      num: 4,
      title: 'Categories Page',
      route: '/categories',
      authRole: 'none',
      description: 'The Categories Page organizes the complete product catalogue into different categories so that customers can easily find the required auto parts. Categories include Body Parts, Bumpers & Protection Guards, Side Mirrors, Lights & Indicators, Brake Systems, Engine & Clutch Parts, Suspension Parts, Electrical & Wiring, Decorative Items & Badges, and Accessories & Canopies. Selecting a category displays the products associated with that category, making product browsing faster and more convenient for wholesale customers.'
    },
    {
      num: 5,
      title: 'Product Details Page',
      route: `/products/${productId}`,
      authRole: 'none',
      description: 'The Product Details Page displays complete information about a selected auto part or accessory. It includes the product image, product name, description, category, brand, wholesale price, minimum order quantity (MOQ), available stock or availability status, and technical specifications. The page also provides an option for the customer to enter the required quantity and proceed towards a bulk quotation or enquiry.'
    },
    {
      num: 6,
      title: 'Search Page',
      route: '/search?q=Bumper',
      authRole: 'none',
      description: 'The Search Page allows wholesale customers to quickly find a required product from the catalogue. Customers can enter keywords such as "Bumper," "Side Mirror," "Brake Shoe," "Headlight," or "Decorative Item." The system searches the available product records and displays matching results. Search and filtering functionality reduces the time required to manually browse through different product categories.'
    },
    {
      num: 7,
      title: 'Login & Signup Page',
      route: '/login',
      altRoute: '/signup',
      authRole: 'none',
      description: 'The Login and Signup Pages provide authentication facilities for wholesale customers. A new customer can create an account by providing information such as name, business name, mobile number, email address, password, and address. Existing customers can log in using their registered credentials. After successful authentication, the customer can access protected features such as profile management and bulk order or quotation enquiry facilities.'
    },
    {
      num: 8,
      title: 'Bulk Order / Quote Request Page',
      route: '/quote',
      authRole: 'customer',
      description: 'The Bulk Order or Quote Request Page is an important interface because Roshani Traders operates on a wholesale-only basis. The customer selects one or more products and enters the required quantity. The system checks whether the entered quantity satisfies the product\'s Minimum Order Quantity (MOQ). If the requested quantity is equal to or greater than the MOQ, the quotation request can be submitted. The page also collects required customer and business information and allows additional remarks or requirements to be entered.'
    },
    {
      num: 9,
      title: 'User Profile Page',
      route: '/profile',
      authRole: 'customer',
      description: 'The User Profile Page allows authenticated wholesale customers to view and manage their registered information. The page displays details such as customer name, business/shop name, email, mobile number, address and city. Customers can update permitted information and can also view their previous quotation or enquiry records. This provides customers with a personalized area for managing their interaction with Roshani Traders.'
    },
    {
      num: 10,
      title: 'Contact & Enquiry Page',
      route: '/contact',
      authRole: 'none',
      description: 'The Contact and Enquiry Page provides a communication interface between wholesale customers and Roshani Traders. Customers can submit their name, business name, mobile number, email, subject, and detailed message. They can use this page to enquire about product availability, wholesale pricing, MOQ, bulk requirements, or other business-related questions. The submitted enquiry is stored in the system so that the administrator can review and respond to it.'
    },
    {
      num: 11,
      title: 'Admin Login Page',
      route: '/admin/login',
      authRole: 'none',
      description: 'The Admin Login Page provides a secure entry point for authorized administrators. The administrator enters the registered email and password, after which the system validates the credentials. On successful authentication, the administrator is redirected to the Admin Dashboard. Unauthorized users are prevented from accessing protected administrative pages.'
    },
    {
      num: 12,
      title: 'Admin Dashboard Page',
      route: '/admin',
      authRole: 'admin',
      description: 'The Admin Dashboard provides an overall view of the Roshani Traders management system. It presents important business statistics such as total products, total categories, registered customers, pending bulk enquiries, completed orders, and customer enquiries. The dashboard also provides quick navigation to product management, category management, user management, order management, content management, and enquiry management sections.'
    },
    {
      num: 13,
      title: 'Admin Product Management Page',
      route: '/admin/products',
      authRole: 'admin',
      description: 'The Admin Product Management Page allows administrators to maintain the complete product catalogue. The administrator can add new three-wheeler auto parts and accessories, update existing product information, change wholesale prices, define MOQ, update stock or availability status, upload product images, assign categories, and deactivate obsolete products. This ensures that customers always receive updated product information.'
    },
    {
      num: 14,
      title: 'Admin Category Management Page',
      route: '/admin/categories',
      authRole: 'admin',
      description: 'The Admin Category Management Page allows administrators to create and maintain product categories. Administrators can add new categories, update category names and descriptions, upload category images where required, change category status, and manage the products associated with each category. This helps maintain an organized product catalogue.'
    },
    {
      num: 15,
      title: 'Admin Order & Enquiry Management Page',
      route: '/admin/orders',
      authRole: 'admin',
      description: 'The Admin Order and Enquiry Management Page allows the administrator to view and process wholesale quotation requests submitted by customers. The administrator can view customer information, selected products, requested quantities, MOQ, estimated amount, remarks, and submission date. The administrator can update the request status such as Pending, Confirmed, Processing, Completed, Rejected, or Cancelled, allowing the wholesale enquiry process to be tracked systematically.'
    },
    {
      num: 16,
      title: 'Admin User Management Page',
      route: '/admin/users',
      authRole: 'admin',
      description: 'The Admin User Management Page allows the administrator to view and manage registered wholesale customers. The administrator can review customer information, update permitted user details, manage account status, and monitor registered users. This interface helps maintain accurate customer records and provides better control over system access.'
    },
    {
      num: 17,
      title: 'Admin Content Management Page',
      route: '/admin/content',
      authRole: 'admin',
      description: 'The Admin Content Management Page allows administrators to manage the information displayed on the public website. The administrator can update content such as the Home Page information, About Us details, business information, banners, FAQs, contact information, and promotional messages. This allows website information to be updated without modifying the complete application source code.'
    },
    {
      num: 18,
      title: 'Admin Enquiry Management Page',
      route: '/admin/enquiries',
      authRole: 'admin',
      description: 'The Admin Enquiry Management Page displays enquiries submitted through the Contact and Enquiry Page. The administrator can view the customer\'s name, business name, email, mobile number, subject, message, and enquiry status. Enquiries can be processed by changing their status from Pending to In Progress, Resolved, or Closed, helping Roshani Traders maintain proper communication with wholesale customers.'
    }
  ];

  const screenshotsMap = {};

  for (let mod of modules) {
    console.log(`Processing Module ${mod.num}: ${mod.title} (${mod.route})...`);
    
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    
    if (mod.authRole === 'customer' && customerToken) {
      await page.evaluate((tok, usr) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
      }, customerToken, customerUser);
    } else if (mod.authRole === 'admin' && adminToken) {
      await page.evaluate((tok, usr) => {
        localStorage.setItem('token', tok);
        localStorage.setItem('user', JSON.stringify(usr));
      }, adminToken, adminUser);
    } else if (mod.route === '/admin/login' || mod.route === '/login') {
      await page.evaluate(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }

    await page.goto(`${BASE_URL}${mod.route}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    const imgPath = path.join(OUTPUT_DIR, `module_${mod.num}.png`);
    await page.screenshot({ path: imgPath, fullPage: false });
    
    const imgBuffer = fs.readFileSync(imgPath);
    const base64Img = `data:image/png;base64,${imgBuffer.toString('base64')}`;
    
    let altBase64Img = null;
    if (mod.altRoute) {
      await page.goto(`${BASE_URL}${mod.altRoute}`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1200));
      const altImgPath = path.join(OUTPUT_DIR, `module_${mod.num}_signup.png`);
      await page.screenshot({ path: altImgPath, fullPage: false });
      const altImgBuffer = fs.readFileSync(altImgPath);
      altBase64Img = `data:image/png;base64,${altImgBuffer.toString('base64')}`;
    }

    screenshotsMap[mod.num] = { base64Img, altBase64Img };
  }

  await browser.close();

  console.log('Generating PDF HTML document with all 18 module screenshots...');

  let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Roshani Traders - Complete Module Documentation & Screenshots</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background: #f8fafc;
        color: #0f172a;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
      }
      .cover-page {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 3rem;
        text-align: center;
        page-break-after: always;
      }
      .cover-logo {
        width: 90px;
        height: 90px;
        background: #f59e0b;
        color: #0f172a;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: 900;
        margin-bottom: 2rem;
        box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
      }
      .cover-title {
        font-size: 2.6rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 1rem 0;
        letter-spacing: -0.5px;
      }
      .cover-subtitle {
        font-size: 1.4rem;
        color: #f59e0b;
        font-weight: 600;
        margin-bottom: 2rem;
      }
      .cover-badge {
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.4);
        padding: 8px 20px;
        border-radius: 9999px;
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 3rem;
      }
      .cover-meta {
        font-size: 0.95rem;
        color: #94a3b8;
        line-height: 1.8;
      }

      .module-page {
        width: 100vw;
        height: 100vh;
        padding: 2.5rem;
        background: #ffffff;
        page-break-after: always;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 0.75rem;
        margin-bottom: 1rem;
      }
      .mod-tag {
        background: #f59e0b;
        color: #0f172a;
        font-size: 0.85rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .mod-route {
        font-family: monospace;
        background: #f1f5f9;
        color: #0284c7;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 600;
      }
      .mod-title {
        font-size: 1.6rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 0.75rem 0;
      }
      .mod-desc {
        font-size: 0.92rem;
        line-height: 1.55;
        color: #334155;
        background: #f8fafc;
        border-left: 4px solid #f59e0b;
        padding: 0.75rem 1rem;
        border-radius: 0 8px 8px 0;
        margin-bottom: 1rem;
      }
      .screenshot-container {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0f172a;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #cbd5e1;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      }
      .screenshot-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: top center;
      }
      .dual-screenshots {
        display: flex;
        gap: 12px;
        flex: 1;
        width: 100%;
      }
      .dual-screenshots .screenshot-container {
        flex: 1;
      }
      .footer-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: #94a3b8;
        border-top: 1px solid #e2e8f0;
        padding-top: 0.5rem;
        margin-top: 0.75rem;
      }
    </style>
  </head>
  <body>
    <!-- COVER PAGE -->
    <div class="cover-page">
      <div class="cover-logo">RT</div>
      <div class="cover-title">ROSHANI TRADERS</div>
      <div class="cover-subtitle">Three Wheeler Auto Parts Wholesale Management System</div>
      <div class="cover-badge">Complete Module System Documentation & Visual UI Catalog</div>
      <div class="cover-meta">
        <p><strong>System Modules:</strong> 18 Functional Modules & Administrative Interfaces</p>
        <p><strong>Target Platform:</strong> Wholesale Auto Rickshaw Spare Parts & Accessories</p>
        <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
      </div>
    </div>
  `;

  for (let mod of modules) {
    const screenshots = screenshotsMap[mod.num];
    htmlContent += `
    <div class="module-page">
      <div>
        <div class="header-bar">
          <span class="mod-tag">Module ${mod.num} of 18</span>
          <span class="mod-route">${mod.route}</span>
        </div>
        <h2 class="mod-title">${mod.num}. ${mod.title}</h2>
        <div class="mod-desc">${mod.description}</div>
      </div>
      
      ${mod.altRoute ? `
        <div class="dual-screenshots">
          <div class="screenshot-container">
            <img class="screenshot-img" src="${screenshots.base64Img}" alt="${mod.title} Login" />
          </div>
          <div class="screenshot-container">
            <img class="screenshot-img" src="${screenshots.altBase64Img}" alt="${mod.title} Signup" />
          </div>
        </div>
      ` : `
        <div class="screenshot-container">
          <img class="screenshot-img" src="${screenshots.base64Img}" alt="${mod.title}" />
        </div>
      `}

      <div class="footer-bar">
        <span>Roshani Traders Management System</span>
        <span>Module ${mod.num} / 18</span>
      </div>
    </div>
    `;
  }

  htmlContent += `
  </body>
  </html>
  `;

  console.log('Converting HTML to PDF with Puppeteer...');
  const pdfBrowser = await puppeteer.launch(launchOptions);
  const pdfPage = await pdfBrowser.newPage();
  await pdfPage.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await pdfPage.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await pdfBrowser.close();

  try {
    fs.copyFileSync(PDF_PATH, ARTIFACT_PDF_PATH);
  } catch (err) {
    console.warn('Could not copy to artifact path:', err.message);
  }

  console.log(`PDF successfully generated and saved to:\n1. ${PDF_PATH}`);
}

run().catch(console.error);
