# System Architecture & Technical Specifications

## Roshani Traders – Three Wheeler Auto Parts Wholesale Management System

### 1. High-Level Architecture Overview

Roshani Traders is architected as a modern, decoupled client-server web application with a relational MySQL database tier:

```
[ Customer / Admin Web Browser ]
              │
              ▼  (HTTP / REST / JSON)
[ React.js + Vite Client (Port 3000) ]
              │
              ▼  (/api Proxy)
[ Node.js + Express REST API (Port 5000) ]
              │
        ┌─────┴──────────────────┐
        ▼                        ▼
[ MySQL Server 8.0.46 ]    [ AI Assistant Service ]
(Port 3306 Relational DB)  (Catalogue-Aware Engine)
```

---

### 2. Tier Breakdown

#### 2.1 Frontend Tier (`client/`)
- **Framework**: React 18 with Vite build tool.
- **Styling**: Tailwind CSS for responsive, mobile-first design.
- **Routing**: React Router DOM (v6) with public and protected admin/customer routes.
- **API Client**: Axios configured with baseURL and automatic JWT bearer token interceptors.
- **Components**:
  - Customer Portal: Navbar, Footer, Hero Banners, Category Showcase, Featured Products, Testimonials, FAQs.
  - Parts Catalog: Dynamic category filters, search bar, vehicle model selector, price slider, and pagination.
  - Product Details: Live stock indicator, MOQ badge, technical specs table, vehicle compatibility tags, and quote builder button.
  - Floating AI Assistant: Floating chat modal with quick prompts, conversational search, quote drafting, and compatibility checks.
  - Wholesale Cart / Quote Builder: Item quantity controls (MOQ enforced), custom remarks, GST/transporter details.
  - Customer Dashboard: Quote submission history and live delivery tracking status.
  - Admin Dashboard: Sales/quote metrics, order status manager, customer toggles, catalogue manager, CMS editor.

#### 2.2 Backend Tier (`server/`)
- **Runtime**: Node.js (v22 LTS).
- **Web Server**: Express.js with JSON parser, URL encoder, and CORS middleware.
- **Database Driver**: `mysql2/promise` with connection pooling.
- **Authentication**: JWT (`jsonwebtoken`) signed with HMAC SHA-256 and bcryptjs password hashing.
- **Authorization**: Role-based access control (`customer`, `admin`).
- **Data Validation**: Parameterized SQL queries to prevent SQL injection vulnerabilities.
- **Transaction Management**: ACID MySQL transactions for quotes and quote items creation.

#### 2.3 Database Tier (`MySQL 8.0.46`)
- **Host**: `127.0.0.1:3306`
- **Database**: `roshani_traders`
- **Charset / Collation**: `utf8mb4` / `utf8mb4_unicode_ci`
- **Tables (8 Normalized Tables)**:
  1. `users`: Customer and admin wholesale accounts.
  2. `categories`: 10 auto parts classifications.
  3. `products`: 28 three-wheeler auto parts catalog records.
  4. `quotes`: Wholesale quotation headers with tracking info.
  5. `quote_items`: Relational line items linked to quotes and products.
  6. `enquiries`: B2B customer inquiries with AI summary data.
  7. `contents`: Homepage CMS content and section data.
  8. `faqs`: Frequently asked wholesale questions.

#### 2.4 AI Recommendation Engine (`server/services/aiService.js`)
- Intelligent, catalogue-aware recommendation service querying live MySQL records.
- Capabilities:
  - Vehicle model compatibility matching (Bajaj RE, Piaggio Ape, TVS King, Mahindra Alfa).
  - Minimum Order Quantity (MOQ) enforcement and stock level checks.
  - Budget filtering (`under ₹1,000`, etc.).
  - Conversational quote drafting with live catalogue price estimates.
  - Automatic enquiry summarization for admin prioritization.
