# Vattanac Brewery Platform

A modern, full-stack digital platform inspired by a brewery business, designed to manage products, customers, orders, inventory, promotions, payments, and sales across web and mobile applications.

> ⚠️ **Disclaimer**
>
> This project is a **demo / personal development project** created for learning, development, and portfolio purposes.
>
> It is **not the official Vattanac Brewery website, mobile application, or business system** and is **not affiliated with, endorsed by, or officially connected to Vattanac Brewery**.
>
> Any company names, product names, logos, images, descriptions, or other related content are used for **demonstration purposes only**.

## 🚀 Project Overview

Vattanac Brewery Platform is a full-stack e-commerce and product management system featuring four main applications:

* **Admin Dashboard** — Manage products, orders, inventory, customers, promotions, and analytics
* **Client Website** — Customer-facing website for browsing products and placing orders
* **Mobile App** — Mobile shopping and ordering experience
* **Backend Server** — RESTful API for authentication, products, orders, payments, inventory, and business operations

## 🏗️ Architecture

```text
VattanacBrewery/
│
├── admin/          # React + Vite Admin Dashboard
├── client/         # Next.js Customer Website
├── mobileapp/      # React Native Mobile App
└── server/         # Node.js + Express API Backend
```

## 🛠️ Technology Stack

### Frontend

#### Admin Dashboard

* React 18
* TypeScript
* Vite
* TailwindCSS
* shadcn/ui
* Radix UI
* Lucide React

#### Client Website

* Next.js 14
* TypeScript
* TailwindCSS
* shadcn/ui
* Radix UI
* Lucide React

#### Mobile Application

* React Native
* TypeScript
* Expo
* React Native components

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* RESTful APIs
* Cloudinary
* Swagger/OpenAPI

### State Management & Forms

* Zustand
* React Hook Form
* Zod
* Axios
* Fetch API

## 🚀 Quick Start

### Prerequisites

Before running the project, make sure you have:

* Node.js 18+
* npm or yarn
* MongoDB local installation or MongoDB Atlas
* Cloudinary account

### 1. Clone the Repository

```bash
git clone <repository-url>

cd VattanacBrewery
```

### 2. Setup Backend Server

```bash
cd server

npm install

cp .env.example .env
```

Configure the `.env` file and then run:

```bash
npm run dev
```

Backend server:

```text
http://localhost:8000
```

### 3. Setup Client Website

```bash
cd client

npm install

npm run dev
```

Client website:

```text
http://localhost:3000
```

### 4. Setup Admin Dashboard

```bash
cd admin

npm install

npm run dev
```

Admin dashboard:

```text
http://localhost:5173
```

### 5. Setup Mobile App

```bash
cd mobileapp

npm install

npm start
```

Follow the Expo instructions to run the application on Android or iOS.

## 📱 Application Details

### 🖥️ Admin Dashboard

**Purpose:** Administrative management system for the demo brewery platform.

**Technology:**

* React
* Vite
* TypeScript
* TailwindCSS
* shadcn/ui

**Features:**

* 📊 Dashboard Analytics
* 🍺 Product Management
* 📦 Inventory Management
* 🛒 Order Management
* 👥 Customer Management
* 🏷️ Category Management
* 🎁 Promotion Management
* 📸 Product Image Management
* 💳 Payment Management
* 🔐 Role-Based Access Control
* 📈 Sales Reports
* 💰 Revenue Reports
* 👤 User Management

**Access:**

```text
http://localhost:5173
```

**Start Command:**

```bash
npm run dev
```

### 🌐 Client Website

**Purpose:** Customer-facing e-commerce website for browsing products and placing orders.

**Technology:**

* Next.js
* TypeScript
* TailwindCSS
* shadcn/ui

**Features:**

* 🍺 Product Browsing
* 🔍 Product Search
* 🎯 Product Filtering
* 🏷️ Product Categories
* 🛒 Shopping Cart
* 💳 Checkout
* 👤 Customer Authentication
* 📦 Order Tracking
* 📋 Order History
* ⭐ Product Reviews
* ❤️ Wishlist
* 🎁 Promotions
* 📱 Responsive Design

**Access:**

```text
http://localhost:3000
```

**Start Command:**

```bash
npm run dev
```

### 📱 Mobile App

**Purpose:** Mobile shopping and ordering application for the demo platform.

**Technology:**

* React Native
* TypeScript
* Expo

**Features:**

* 📱 Native Mobile Experience
* 🍺 Product Browsing
* 🔍 Product Search
* 🛒 Shopping Cart
* 💳 Mobile Checkout
* 👤 Customer Authentication
* 📦 Order Tracking
* 📋 Order History
* 🔔 Push Notifications
* 🎁 Promotions
* 📍 Location Services
* 📷 Camera Integration
* 📴 Offline Support
* 🔄 Web & Mobile Synchronization

### 🔧 Backend Server

**Purpose:** Central RESTful API for all applications.

**Technology:**

* Node.js
* Express.js
* MongoDB
* JWT
* Cloudinary
* Swagger/OpenAPI

**Features:**

* 🔐 Authentication
* 👥 User Management
* 🍺 Product Management
* 🏷️ Category Management
* 📦 Inventory Management
* 🛒 Order Processing
* 💳 Payment Processing
* 🎁 Promotion Management
* 📸 File Upload
* ☁️ Cloudinary Integration
* 📝 Logging
* 🔄 Request Validation
* 📖 Swagger API Documentation

**Backend URL:**

```text
http://localhost:8000
```

**Swagger Documentation:**

```text
http://localhost:8000/api-docs
```

## 🔧 Configuration

### Server `.env`

```bash
NODE_ENV=development

PORT=8000

MONGODB_URI=mongodb://localhost:27017/VattanacBrewery

JWT_SECRET=your-jwt-secret

CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173
```

### Client `.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

### Admin `.env`

```bash
VITE_API_URL=http://localhost:8000/api

VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

See `configuration.md` for complete environment configuration.

## 🍺 Product Management

The platform can manage different brewery-related products for demonstration purposes.

Example product categories:

* Beer
* Lager
* Premium Beer
* Craft Beer
* Non-Alcoholic Beverages
* Soft Drinks
* Seasonal Products
* Promotional Products
* Product Bundles
* Merchandise

Each product can contain:

* Product name
* Product description
* Product image
* Category
* Brand
* Price
* Discount price
* Stock quantity
* SKU
* Product status
* Product size
* Product packaging
* Promotion
* Created date
* Updated date

## 📦 Order Management

The platform supports a complete order lifecycle:

```text
Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Ready
   ↓
Shipped
   ↓
Delivered
```

Orders can contain:

* Customer information
* Products
* Quantity
* Unit price
* Discount
* Subtotal
* Total amount
* Delivery address
* Payment method
* Payment status
* Order status
* Order date

## 💳 Payment Management

The platform can be configured to support different payment methods depending on the implementation.

Example payment methods:

* Cash on Delivery
* Bank Transfer
* QR Payment
* Online Payment
* Digital Wallet

Payment status:

```text
Pending
Paid
Failed
Cancelled
Refunded
```

## 📊 Analytics Dashboard

The Admin Dashboard can display:

* Total sales
* Daily sales
* Weekly sales
* Monthly sales
* Total orders
* Completed orders
* Pending orders
* Cancelled orders
* Total customers
* Best-selling products
* Low-stock products
* Inventory value
* Revenue
* Payment reports
* Sales trends

## 📦 Inventory Management

Administrators can manage:

* Product stock
* Stock availability
* Low-stock alerts
* Stock adjustments
* Product SKU
* Product packaging
* Inventory history
* Product status

Example inventory status:

```text
In Stock
Low Stock
Out of Stock
Inactive
```

## 🎁 Promotion Management

The platform can support promotional campaigns such as:

* Discount codes
* Percentage discounts
* Fixed amount discounts
* Product promotions
* Category promotions
* Seasonal promotions
* Promotional bundles
* Limited-time offers

Example:

```text
PROMO10
10% OFF
Minimum Order: $20
```

## 🔐 Authentication & Authorization

The platform uses JWT-based authentication.

Example user roles:

```text
ADMIN
STAFF
CUSTOMER
```

Permissions can be configured based on the user's role.

### Admin

Can manage:

* Products
* Categories
* Inventory
* Orders
* Customers
* Promotions
* Payments
* Reports
* Users

### Staff

Can manage:

* Orders
* Products
* Inventory
* Customers

### Customer

Can:

* Browse products
* Add products to cart
* Place orders
* Make payments
* View orders
* Manage profile
* Review products

## 🔄 API Architecture

The backend follows a RESTful API architecture.

Example endpoints:

```text
/api/auth
/api/users
/api/products
/api/categories
/api/inventory
/api/orders
/api/payments
/api/promotions
/api/customers
/api/uploads
```

Example product APIs:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Example order APIs:

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

## 📖 API Documentation

Swagger/OpenAPI documentation is available when the backend server is running:

```text
http://localhost:8000/api-docs
```

The API documentation can be used to test and understand the available REST APIs.

## 📈 Dashboard Metrics

Example dashboard metrics:

```text
Total Revenue
$25,450

Total Orders
1,245

Total Customers
856

Total Products
128

Pending Orders
42

Low Stock Products
12
```

These values are example/demo data and do not represent real Vattanac Brewery business information.

## 🚀 Deployment

### Frontend

The frontend applications can be deployed using:

* Vercel
* Netlify
* AWS
* Other cloud hosting platforms

### Backend

The backend can be deployed using:

* AWS
* Railway
* Render
* DigitalOcean
* Other cloud infrastructure

### Database

MongoDB Atlas can be used for production database hosting.

### Mobile Application

The mobile application can be prepared for:

* Google Play Store
* Apple App Store

> **Note:** Any production deployment should use the appropriate company authorization, branding, domain names, infrastructure, and business data.

## 🔮 Upcoming Features

* [ ] Multi-language support
* [ ] Advanced analytics dashboard
* [ ] AI-powered product recommendations
* [ ] Loyalty points
* [ ] Customer membership
* [ ] Coupon system
* [ ] Promotional campaigns
* [ ] Advanced inventory management
* [ ] Delivery management
* [ ] Real-time order tracking
* [ ] Push notification campaigns
* [ ] Multi-branch management
* [ ] Distributor management
* [ ] B2B ordering
* [ ] Wholesale pricing
* [ ] Advanced reporting
* [ ] Sales forecasting
* [ ] Customer segmentation

## 📂 Project Documentation

The project can contain the following documentation:

```text
docs/
│
├── setup.md
├── configuration.md
├── architecture.md
├── api.md
└── deployment.md
```

### Setup Guide

See:

```text
setup.md
```

for detailed installation and development instructions.

### Configuration

See:

```text
configuration.md
```

for environment variables and application configuration.

### Architecture

See:

```text
architecture.md
```

for detailed system architecture and project structure.

### API Documentation

Available at:

```text
http://localhost:8000/api-docs
```

when the backend server is running.

## 🤝 Contributing

1. Fork the repository

2. Create a feature branch:

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes:

```bash
git commit -m "Add some AmazingFeature"
```

4. Push the branch:

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

## 📞 Support

For development-related questions or issues:

* Create an issue in the repository
* Check the project documentation
* Review the API documentation
* Review the configuration files
* Contact the project developer

## 📜 License

This project is a **demo / personal development project** created for educational and portfolio purposes.

It is not an official Vattanac Brewery product or system.

If this project is later used commercially, appropriate authorization, licensing, branding, and intellectual-property permissions should be obtained.

## ⚠️ Important Disclaimer

This repository is **NOT the official Vattanac Brewery website or application**.

It is an independent demonstration project created to showcase full-stack software development skills using:

* React
* Next.js
* React Native
* Expo
* Node.js
* Express.js
* MongoDB
* TypeScript
* TailwindCSS
* JWT
* Cloudinary
* Swagger/OpenAPI

No real customer information, transaction information, internal company information, or confidential business data should be used in this project.

All sample products, prices, orders, customers, analytics, and other business information should be treated as **fictional/demo data**.

---

## 🙏 Acknowledgments

Built as a full-stack software development project demonstrating:

* Modern web development
* Mobile application development
* REST API development
* Database design
* Authentication and authorization
* E-commerce architecture
* Admin dashboard development
* Cloud file storage
* API documentation
* Responsive UI development

**Vattanac Brewery Platform — Demo Project 🍺🚀**

> **This is a demo project and is not the official Vattanac Brewery website, application, or system.**
