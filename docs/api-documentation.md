# REST API Reference Documentation

Base URL: `http://localhost:5000/api`

---

### Authentication (`/api/auth`)

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public | Register new wholesale customer account |
| `/api/auth/login` | `POST` | Public | Customer / Admin login with email & password |
| `/api/auth/admin-login`| `POST` | Public | Dedicated admin authentication endpoint |
| `/api/auth/me` | `GET` | Private | Retrieve currently authenticated user profile |
| `/api/auth/profile` | `PUT` | Private | Update authenticated user profile |

---

### Products (`/api/products`)

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/products` | `GET` | Public | Fetch paginated products with category/search/brand/model filters |
| `/api/products/:id` | `GET` | Public | Fetch product by numeric ID or URL slug |
| `/api/products` | `POST` | Admin | Create a new auto part product record in MySQL |
| `/api/products/:id` | `PUT` | Admin | Update product details, stock, pricing, and specs |
| `/api/products/:id` | `DELETE`| Admin | Delete product from catalog |
| `/api/products/:id/status`| `PUT`| Admin | Toggle product active/inactive status |

---

### Categories (`/api/categories`)

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/categories` | `GET` | Public | Fetch all 10 product categories with product counts |
| `/api/categories` | `POST` | Admin | Create a new product category |
| `/api/categories/:id`| `PUT` | Admin | Update category name, slug, description, image |
| `/api/categories/:id`| `DELETE`| Admin | Delete a category (restricted if products exist) |

---

### Quotations & Order Tracking (`/api/quotes`)

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/quotes` | `POST` | Public/Customer | Submit bulk quote request with line items |
| `/api/quotes/my-quotes`| `GET` | Customer | Fetch quotes submitted by logged-in customer |
| `/api/quotes/track/:code`| `GET`| Public | Fetch live shipment & tracking info by code |
| `/api/quotes` | `GET` | Admin | Fetch all customer quotations with items |
| `/api/quotes/:id` | `GET` | Admin/Customer | Fetch single quotation details |
| `/api/quotes/:id/status`| `PUT` | Admin | Update quote status (Confirmed, Processing, etc.) |
| `/api/quotes/:id/tracking`| `PUT`| Admin | Update shipment location and tracking milestones |

---

### Customer Enquiries (`/api/enquiries`)

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/enquiries` | `POST` | Public | Submit customer wholesale enquiry |
| `/api/enquiries` | `GET` | Admin | Fetch all customer enquiries |
| `/api/enquiries/:id`| `PUT` | Admin | Update enquiry status (New, In Progress, Closed) |
| `/api/enquiries/:id`| `DELETE`| Admin | Delete enquiry |
| `/api/enquiries/:id/ai-summary`| `POST`| Admin | Generate & persist AI summary for enquiry |

---

### AI Auto Parts Assistant (`/api/ai`)

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/ai/chat` | `POST` | Public | Conversational assistant, vehicle match & quote draft |
| `/api/ai/recommend` | `POST` | Public | Get product recommendations by query/budget/model |
| `/api/ai/summarize-enquiry`| `POST`| Admin/Public | Generate structured AI summary for inquiry text |

---

### System Health (`/api/health`)

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/health` | `GET` | Public | Health check reporting MySQL engine version & uptime |
