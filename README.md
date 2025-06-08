# 🍛 Masai Bistro - Restaurant Management System

A comprehensive restaurant management system built specifically for **Masai Bistro**, featuring authentic Indian cuisine management with MongoDB, Node.js, Express, and React. This system allows Indian restaurants to manage their menu, process orders, handle GST calculations, and analyze business performance with full Indian localization.

![Masai Bistro](https://img.shields.io/badge/Masai%20Bistro-Restaurant%20Management-orange)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)

## 🌟 Features

### 🍛 **Core Functionality**
- **Dynamic Menu Management** - Add, edit, delete authentic Indian menu items with categories
- **Order Processing** - Complete order lifecycle from placement to delivery
- **User Authentication** - JWT-based auth with role-based access control
- **Analytics Dashboard** - Sales reports, popular dishes, peak hours analysis
- **Search & Filter** - Advanced menu search with multiple filter options
- **Real-time Updates** - Live order status tracking and menu updates

### 🇮🇳 **Indian Restaurant Specialization**
- **Authentic Styling** - Saffron, deep red, and gold color scheme representing Indian culture
- **Currency Support** - Indian Rupee (₹) formatting throughout with proper locale
- **Cultural Elements** - Indian restaurant branding and terminology
- **Dietary Indicators** - Vegetarian/non-vegetarian symbols, spice level indicators (🌿🌶️🔥)
- **Local Settings** - IST timezone, 18% GST tax rates, Indian address formats
- **Masai Bistro Branding** - Fully customized for Masai Bistro restaurant

### 🛠️ **Technical Features**
- **Responsive Design** - Mobile-first approach with Material-UI
- **RESTful API** - Well-structured backend with proper HTTP methods
- **Data Validation** - Comprehensive input validation and error handling
- **Security** - Password hashing, JWT tokens, protected routes
- **Performance** - MongoDB indexing and optimized queries

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** for cloning the repository

### Step-by-Step Installation

#### 1. **Clone and Setup Project**
```bash
# Clone the repository
git clone https://github.com/PavanKoder27/masai_bistro_MongoDB_pk27
cd Masai-Bistro

# Install backend dependencies
npm install

# Install frontend dependencies
cd restaurant-frontend
npm install
cd ..
```

#### 2. **Environment Configuration**
Create a `.env` file in the root directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/masai_bistro_db
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/masai_bistro_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (Change in production!)
JWT_SECRET=masai_bistro_super_secret_jwt_key_2024_change_in_production

# CORS Configuration
FRONTEND_URL=http://localhost:3001

# Masai Bistro Specific Settings
RESTAURANT_NAME=MASAI BISTRO
RESTAURANT_EMAIL=info@masaibistro.com
RESTAURANT_PHONE=+91-80-4567-8900
```

#### 3. **Database Initialization**
```bash
# Initialize restaurant settings
node scripts/initializeSettings.js

# Seed database with Masai Bistro menu and users
node scripts/seedData.js

# You should see:
# "🎉 Masai Bistro sample data seeded successfully!"
# "🔑 Login credentials for Masai Bistro:"
```

#### 4. **Start the Application**

**Terminal 1 - Backend Server:**
```bash
npm start
# Should show: "Server is running on port 3000"
# Should show: "MongoDB Connected"
```

**Terminal 2 - Frontend Server:**
```bash
cd restaurant-frontend
npm start
# Will start on port 3001 (or next available port)
# Should automatically open browser to http://localhost:3001
```

#### 5. **Verify Installation**
- **Frontend**: http://localhost:3001 (React app)
- **Backend API**: http://localhost:3000/api/menu (JSON response)
- **MongoDB**: Should be running on port 27017

### 👥 **Default Login Credentials for Masai Bistro**

After seeding, use these credentials to test the system:

| Role | Email | Password | Name | Access Level |
|------|-------|----------|------|--------------|
| **Admin** | admin@masaibistro.com | Admin123! | Arjun Patel | Full system access, analytics, settings |
| **Manager** | manager@masaibistro.com | Manager123! | Priya Sharma | Menu & order management, analytics |
| **Staff** | staff@masaibistro.com | Staff123! | Rahul Singh | Order processing, status updates |

## 📚 API Documentation

### Base URL: `http://localhost:3000/api`

### Authentication Endpoints
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@masaibistro.com",
  "password": "Admin123!"
}
```

### Menu Endpoints
```http
GET /api/menu                    # Get all menu items with pagination
GET /api/menu/categories         # Get menu categories
POST /api/menu                   # Create menu item (Admin/Manager)
PUT /api/menu/:id               # Update menu item (Admin/Manager)
DELETE /api/menu/:id            # Delete menu item (Admin/Manager)
```

### Order Endpoints
```http
GET /api/orders                 # Get orders (Protected)
POST /api/orders                # Create order (Protected)
PATCH /api/orders/:id/status    # Update order status (Staff+)
```

### Analytics Endpoints (Manager/Admin Only)
```http
GET /api/analytics/dashboard      # Dashboard summary
GET /api/analytics/sales          # Sales reports
GET /api/analytics/popular-dishes # Most ordered dishes
```

## 🏗️ Project Structure

```
masai-bistro/
├── 📁 controllers/              # Business logic controllers
├── 📁 middleware/               # Express middleware
├── 📁 models/                   # MongoDB schemas
├── 📁 routes/                   # API route definitions
├── 📁 scripts/                  # Database utilities
├── 📁 config/                   # Configuration files
├── 📁 restaurant-frontend/      # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   ├── 📁 contexts/         # React context providers
│   │   ├── 📁 services/         # API service layer
│   │   └── 📁 utils/            # Utility functions
├── server.js                    # Express server entry point
├── package.json                 # Backend dependencies
└── README.md                    # This documentation
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with flexible schema
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing

### Frontend
- **React** - User interface library
- **Material-UI (MUI)** - Component library with Indian theme
- **Axios** - HTTP client
- **React Router** - Navigation
- **Indian Fonts** - Noto Sans Devanagari support

## 🇮🇳 Indian Localization Features

- **Currency**: Indian Rupee (₹) formatting with proper locale
- **Phone Numbers**: Indian mobile number validation (+91 format)
- **Addresses**: Indian postal code (PIN) validation
- **GST**: 18% Goods and Services Tax calculation
- **Dietary Indicators**: Vegetarian/non-vegetarian symbols
- **Spice Levels**: Indian spice level indicators (mild, medium, hot, very hot)
- **Indian States**: Complete list of Indian states and union territories
- **Time Zone**: Asia/Kolkata (IST) timezone support

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Different access levels for different user types
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS Protection**: Configured CORS for secure cross-origin requests

## 🧪 Testing

### API Testing
```bash
# Test menu endpoint
curl http://localhost:3000/api/menu

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@masaibistro.com","password":"Admin123!"}'
```

### System Validation
```bash
# Run comprehensive system tests
node test-masai-bistro-system.js
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create masai-bistro-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_production_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd restaurant-frontend
vercel --prod
```

## 🛠️ Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port in .env file
PORT=3001
```

**Frontend Build Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## ✅ System Status

### **OPTIMIZATION COMPLETED**

The Masai Bistro Restaurant Management System has been comprehensively optimized with:

#### 🇮🇳 **Indian Localization Features**
- ✅ **Currency Formatting**: Complete ₹ (Indian Rupee) formatting with proper locale
- ✅ **Phone Validation**: Indian mobile number validation (+91 format)
- ✅ **Address Validation**: Indian postal code (PIN) and state validation
- ✅ **GST Integration**: 18% Goods and Services Tax calculation
- ✅ **Cultural Theming**: Saffron and deep red color scheme
- ✅ **Dietary Indicators**: Vegetarian/non-vegetarian symbols with spice levels

#### 🍛 **Masai Bistro Branding**
- ✅ **Restaurant Name**: Fully rebranded as "Masai Bistro" throughout
- ✅ **Indian Staff**: Arjun Patel (Admin), Priya Sharma (Manager), Rahul Singh (Staff)
- ✅ **Authentic Location**: Brigade Road, Bangalore, Karnataka - 560025
- ✅ **Contact Details**: +91-80-4567-8900, info@masaibistro.com

#### 🛠️ **Technical Enhancements**
- ✅ **Enhanced Menu Component**: Indian categories, dietary legends, cultural elements
- ✅ **Currency Utilities**: Comprehensive Indian currency formatting functions
- ✅ **Validation Utilities**: Indian phone, PIN code, and address validation
- ✅ **Dietary Components**: Vegetarian/vegan indicators with spice level displays
- ✅ **Improved Theming**: Material-UI theme with Indian restaurant colors

### 🎯 **Ready for Production**

The system is now fully optimized and ready for authentic Indian restaurant operations!

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ for Masai Bistro - Authentic Indian Restaurant Management**
