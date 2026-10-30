# Roshani Traders – Three Wheeler Auto Parts Wholesale Management System

[![MySQL](https://img.shields.io/badge/MySQL-8.0.46-00758F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Project Overview

**Roshani Traders** is an enterprise-grade **Three Wheeler Auto Parts Wholesale Management System** designed to streamline B2B operations for commercial three-wheeler spare parts (Bajaj RE, Piaggio Ape, TVS King, Mahindra Alfa). The platform enables automotive spare part dealers, regional distributors, and fleet workshops to browse extensive product catalogs, inspect detailed technical specifications, request volume quotations with Minimum Order Quantity (MOQ) controls, track shipments, and interact with a catalogue-aware AI Assistant.

The platform is backed by a robust **MySQL Server 8.0.46** relational database with connection pooling, transactional quotation workflows, and JWT role-based security.

---

## 🎯 Project Objectives

1. **Digitalize Wholesale Operations**: Replace manual paper/phone quotation processes with an automated B2B quote-building and order-tracking pipeline.
2. **Relational Data Integrity**: Guarantee strict consistency, foreign-key relationships, and ACID transaction safety across inventory and customer orders using MySQL 8.0.46.
3. **Catalogue-Aware AI Assistance**: Provide real-time intelligent recommendations, vehicle model compatibility matching, and instant quotation drafting without inventory hallucination.
4. **Wholesale Governance**: Enforce Minimum Order Quantities (MOQ), real-time stock validations, and tiered commercial pricing.
5. **Full Administrative Control**: Equip business owners with tools to manage products, categories, wholesale pricing, quotations, and customer accounts.

---

## 🚀 Key Features

### 👤 Customer Wholesale Portal
- **High-Performance Catalog**: Browse 28 auto parts categorized across 10 vehicle systems with instant keyword search and category filtering.
- **Product Specification & Compatibility**: Detailed technical attributes, dimensions, materials, and vehicle model fitment tags (e.g., Bajaj RE Compact, Piaggio Ape City).
- **Bulk Quote Builder**: Multi-item quotation builder with automated MOQ validation, price estimation, and remarks submission.
- **Live Order Tracking**: Public tracking interface (`/track`) by quotation ID or tracking code with multi-stage milestone updates.
- **Customer Dashboard**: Quote history, status badges (`Pending`, `Confirmed`, `Processing`, `Completed`), and profile management.
- **B2B Inquiry Form**: Dedicated inquiry channel with automatic AI-assisted priority assignment and response suggestions.

### 🤖 Intelligent AI Auto Parts Assistant
- **Catalogue Grounded**: Queries actual MySQL database tables — never invents prices, stock, or unavailable parts.
- **Compatibility Matching**: Detects vehicle make and model (e.g., *"brake drums for Piaggio Ape"*) and filters matching spare parts.
- **Budget-Aware Search**: Filters recommendations within specified budget thresholds (e.g., *"bumpers under ₹1500"*).
- **Quote Draft Calculation**: Parses natural language requests (e.g., *"I need 50 bumpers and 100 mirrors"*), checks MOQ compliance, computes line item subtotals, and outputs a ready-to-submit quote draft.

### 🛡️ Admin Management Dashboard
- **Business Analytics**: High-level overview of total inventory, active quotations, customer accounts, and pending enquiries.
- **Product Lifecycle CRUD**: Add, edit, price-adjust, and deactivate spare parts with image previews and JSON technical specifications.
- **Category Control**: Organize products into 10 structured auto parts categories.
- **Quotation Workflow**: Accept/Confirm quotation requests, assign dispatch documents, and update carrier tracking milestones.
- **Customer Management**: Activate or deactivate dealer accounts.
- **CMS & FAQ Management**: Edit dynamic homepage copy, contact information, and wholesale FAQs.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS | High-performance SPA with modern B2B responsive interface |
| **State / HTTP** | React Hooks, Axios, React Router DOM | Client-side routing, auth context, and API communication |
| **Backend** | Node.js (v22 LTS), Express.js 4 | RESTful API service with CORS and error-handling middleware |
| **Database** | MySQL Server 8.0.46 | Relational database with connection pooling and ACID transactions |
| **Database Driver**| `mysql2/promise` | Async/await connection pool with parameterized query execution |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs` | Stateless token authentication and salted password hashing |
| **Testing** | Node.js Test Suite | End-to-end integration and API verification suite |

---

## 📂 Project Folder Structure

```
roshani-traders-wholesale-management-system/
│
├── client/                               # Frontend Single Page Application
│   ├── public/                           # Static assets
│   │   ├── images/                       # UI assets and logos
│   │   │   └── products/                 # 28 High-resolution product images (WebP/SVG/JPG)
│   │   └── favicon.svg                   # Brand favicon
│   ├── src/                              # Source code
│   │   ├── components/                   # Reusable UI components (Navbar, Footer, AIChat)
│   │   ├── context/                      # Auth and Cart React Context providers
│   │   ├── pages/                        # Main application views (Home, Catalog, Detail, Admin)
│   │   ├── services/                     # Axios API client configuration
│   │   ├── App.jsx                       # Routing and main app container
│   │   └── index.css                     # Tailwind CSS entry point
│   ├── package.json                      # Frontend dependencies
│   ├── tailwind.config.js                # Tailwind theme customization
│   └── vite.config.js                    # Vite configuration with /api reverse proxy
│
├── server/                               # Backend REST API Service
│   ├── config/
│   │   └── db.js                         # Centralized MySQL connection pool & helpers
│   ├── controllers/                      # Business logic controllers (Auth, Products, Quotes, AI)
│   ├── database/
│   │   ├── schema.sql                    # Full DDL: 8 relational tables, indexes, constraints
│   │   ├── seed.sql                      # DML: 10 categories, 28 products, sample users, CMS, FAQs
│   │   └── init_db.js                    # Database migration & seed runner
│   ├── middleware/                       # JWT auth, role authorization, validation middleware
│   ├── models/                           # MySQL model classes (User, Product, Quote, Enquiry, etc.)
│   ├── routes/                           # Express route definitions
│   ├── services/                         # AI Assistant & recommendation engine service
│   ├── uploads/                          # Directory for file attachments (.gitkeep)
│   ├── .env.example                      # Backend environment variable template
│   ├── server.js                         # Application entry point & /api/health endpoint
│   ├── test_mysql_integration.js         # Comprehensive 19-scenario test suite
│   └── package.json                      # Backend dependencies & run scripts
│
├── docs/                                 # Detailed Technical Documentation
│   ├── architecture.md                   # System architecture and data flow
│   ├── database-schema.md                # Relational ER diagram & table specifications
│   └── api-documentation.md              # REST API endpoints and payloads
│
├── .env.example                          # Root environment template
├── .gitignore                            # Comprehensive security exclusion rules
├── LICENSE                               # MIT License
├── package.json                          # Root orchestration scripts
└── README.md                             # Project documentation
```

---

## 🗄️ Database Architecture & Schema

The system uses **8 normalized relational tables** managed under the `roshani_traders` database:

1. **`users`**: Wholesale customer dealers and administrator accounts with bcrypt password hashes.
2. **`categories`**: 10 distinct auto parts categories with image references and URL slugs.
3. **`products`**: 28 catalog items linked to categories with MOQ, stock, JSON specifications, and compatible models.
4. **`quotes`**: Quotation orders with unique tracking codes, order amounts, and delivery milestone history.
5. **`quote_items`**: Relational line items linking products to quotations with captured unit prices and quantities.
6. **`enquiries`**: Wholesale customer inquiries with AI-generated priorities and actionable summaries.
7. **`contents`**: Dynamic CMS content blocks for homepage hero sections, contact details, and marketing.
8. **`faqs`**: Frequently asked questions displayed on the wholesale portal.

Full schema definitions and ER diagrams are available in [docs/database-schema.md](docs/database-schema.md).

---

## ⚙️ Environment Configuration

Copy the example environment file and configure your local MySQL credentials:

```bash
cp .env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=roshani_traders
JWT_SECRET=roshani_traders_super_secret_jwt_key_2026_wholesale
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **Security Note**: Never commit `.env` files to source control. Stored passwords and tokens are strictly excluded by `.gitignore`.

---

## 📦 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/kasimalisunsara-ship-it/roshani-traders-wholesale-management-system.git
cd roshani-traders-wholesale-management-system
```

### 2. Install Dependencies
Install all root, backend, and frontend packages:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Initialize & Seed MySQL Database
Ensure your MySQL Server 8.0.46 service is running, then initialize the database tables and seed data:
```bash
npm run seed
# or
npm run db
```
This automatically runs `schema.sql` and `seed.sql` to populate all 10 categories, 28 auto parts products, default accounts, CMS pages, and FAQs.

---

## 🚦 Running the Application

### Concurrent Development Mode (Recommended)
Start both the Express backend API and Vite frontend dev server together:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **Database Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Running Services Separately
**Backend Server:**
```bash
npm run server
# or
cd server && npm run dev
```

**Frontend Client:**
```bash
npm run client
# or
cd client && npm run dev
```

---

## 🧪 Testing & Verification

The project includes an automated integration test suite that tests all 19 database, API, authentication, quotation, and AI features against a live MySQL instance:

```bash
npm test
```

### Verified Scenarios:
- ✅ MySQL Server 8.0.46 connectivity and version verification
- ✅ Relational table structure and foreign key constraint validation
- ✅ Database health endpoint verification (`GET /api/health`)
- ✅ 10 Categories and 28 auto parts products data integrity
- ✅ Customer registration, bcrypt password hashing, and login
- ✅ Authenticated profile retrieval via JWT (`GET /api/auth/me`)
- ✅ Product catalogue search, category filters, and pagination
- ✅ Multi-item bulk quotation creation with ACID transactions
- ✅ MySQL child line items verification in `quote_items`
- ✅ Customer B2B enquiry creation and status tracking
- ✅ Admin dashboard authentication and role authorization
- ✅ Full Product CRUD (Add, Edit, Delete) via Admin API
- ✅ Quotation status update and tracking history logging
- ✅ AI Assistant conversational engine and vehicle model matching
- ✅ AI Enquiry summarizer with priority categorization
- ✅ CMS content and FAQ loading from MySQL

---

## 🏷️ Product Categories

| Category | Typical Products | Compatible Vehicles |
| :--- | :--- | :--- |
| **Body Parts & Accessories** | Mudguard sets, roof spoilers, rubber handles | Bajaj RE, Piaggio Ape, TVS King |
| **Bumpers & Protection Guards** | Heavy-duty steel front bumpers, rear crash guards | Bajaj Compact RE, Piaggio Ape City |
| **Side Mirrors & Rear View** | Convex side mirrors, chrome heritage mirror sets | Universal 3-Wheeler Mounts |
| **Lights & Indicators** | Halogen headlights, LED taillight clusters, turn signals | Bajaj RE, TVS King, Mahindra Alfa |
| **Brake Systems & Drums** | Semi-metallic brake shoe sets, cast-iron brake drums | Piaggio Ape, Bajaj RE, TVS King |
| **Engine & Clutch Parts** | Cylinder piston kits, carburetors, clutch plate assemblies | Bajaj 2T/4T, Piaggio Diesel |
| **Suspension & Shock Absorbers**| Hydraulic front shock absorbers, leaf spring pin kits | All Commercial Three Wheelers |
| **Electrical & Wiring** | Ignition switch locks, copper wiring harnesses, wiper motors | Universal 12V Systems |
| **Decorative Items & Chrome Badges** | Stop Mono LED reflectors, Dera Patty Inco strips, Morris badges | Customization & Styling |
| **Accessories & Canopies** | Heavy-duty PVC rain canopies, quilted seat covers | Commercial Auto Rickshaws |

---

## 🔑 Default Credentials (Development)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@roshanitraders.com` | `Admin@123456` |
| **Sample Wholesale Dealer** | `customer@autocenter.com` | `Customer@123456` |

---

## 🔒 Security Features

- **No Plaintext Passwords**: Passwords hashed with `bcryptjs` (salt rounds: 10).
- **JWT Protection**: Secure stateless bearer token authorization with expiration.
- **SQL Injection Prevention**: 100% of queries use parameterized prepared statements (`?` bindings).
- **Environment Isolation**: `.env` and sensitive configurations are strictly excluded from git tracking.
- **Role-Based Access Control**: Route-level middleware prevents customers from accessing administrative APIs.
- **Transaction Rollback**: Prevents orphaned quotations if line item insertion fails.

---

## 📸 Screenshots

*(Screenshots of Customer Portal, Parts Catalog, AI Assistant, and Admin Dashboard can be found below)*

| Customer Portal | Parts Catalog |
| :---: | :---: |
| ![Homepage Preview](docs/screenshots/home.png) | ![Catalog Preview](docs/screenshots/catalog.png) |

| AI Auto Parts Assistant | Admin Dashboard |
| :---: | :---: |
| ![AI Assistant](docs/screenshots/ai-assistant.png) | ![Admin Panel](docs/screenshots/admin.png) |

---

## 🔮 Future Enhancements

- **Automated WhatsApp Notifications**: Integrate WhatsApp Cloud API for instant quotation confirmation updates.
- **GST Invoice PDF Generator**: Automated downloadable tax invoices with transporter E-way bill details.
- **Live Inventory Webhooks**: Low-stock alerts and automatic restock notifications for warehouse godown staff.
- **Multi-Warehouse Support**: Inventory split tracking between Mumbai, Bhiwandi, and regional distribution hubs.

---

## 👨‍💻 Project Information

- **Organization**: Roshani Traders
- **Domain**: Three Wheeler Auto Parts Wholesale Distribution
- **Location**: Mumbai, Maharashtra, India
- **Repository**: [https://github.com/kasimalisunsara-ship-it/roshani-traders-wholesale-management-system](https://github.com/kasimalisunsara-ship-it/roshani-traders-wholesale-management-system)
- **License**: [MIT License](LICENSE)
