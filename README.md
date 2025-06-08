# 🍛 Masai Bistro - Restaurant Management System

A comprehensive restaurant management system built specifically for **Masai Bistro**, featuring authentic Indian cuisine management with MongoDB, Node.js, Express, and React. This system allows Indian restaurants to manage their menu, process orders, handle GST calculations, and analyze business performance with full Indian localization.

![Masai Bistro](https://img.shields.io/badge/Masai%20Bistro-Restaurant%20Management-orange)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=material-ui&logoColor=white)

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
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/restaurant_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (Change in production!)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# CORS Configuration
FRONTEND_URL=http://localhost:3001
```

**Note**: The project is currently configured to use MongoDB Atlas. If you want to use a local MongoDB instance, update the `MONGODB_URI` accordingly.

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
# Will start on port 3001 (or next available port like 3002)
# Should automatically open browser to http://localhost:3001 (or assigned port)
```

#### 5. **Verify Installation**
- **Frontend**: http://localhost:3001 or http://localhost:3002 (React app)
- **Backend API**: http://localhost:3000/api/menu (JSON response)
- **MongoDB**: MongoDB Atlas (cloud) - check connection in terminal logs

**Expected Results:**
- Frontend should display Masai Bistro interface with Indian theming
- API should return 32 authentic Indian menu items
- No compilation errors in either terminal
- MongoDB connection successful message in backend terminal

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
Masai-Bistro/
├── 📁 config/                   # Database configuration
├── 📁 controllers/              # Business logic controllers
│   ├── analyticsController.js   # Analytics and reports
│   ├── authController.js        # Authentication logic
│   ├── menuController.js        # Menu management
│   └── orderController.js       # Order processing
├── 📁 middleware/               # Express middleware
│   ├── auth.js                  # JWT authentication
│   └── validation.js            # Input validation
├── 📁 models/                   # MongoDB schemas
│   ├── MenuItem.js              # Menu item model
│   ├── Order.js                 # Order model
│   ├── RestaurantSettings.js    # Settings model
│   └── User.js                  # User model
├── 📁 restaurant-frontend/      # React frontend application
│   ├── 📁 public/               # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   │   ├── 📁 Admin/        # Admin dashboard
│   │   │   ├── 📁 Auth/         # Authentication
│   │   │   ├── 📁 Cart/         # Shopping cart
│   │   │   ├── 📁 Common/       # Shared components
│   │   │   ├── 📁 Dashboard/    # Main dashboard
│   │   │   ├── 📁 Layout/       # Layout components
│   │   │   ├── 📁 Menu/         # Menu display
│   │   │   ├── 📁 Orders/       # Order management
│   │   │   └── 📁 Profile/      # User profile
│   │   ├── 📁 contexts/         # React context providers
│   │   │   ├── AuthContext.js   # Authentication context
│   │   │   └── CartContext.js   # Cart context
│   │   ├── 📁 services/         # API service layer
│   │   │   └── api.js           # API client
│   │   ├── 📁 utils/            # Utility functions
│   │   │   ├── currencyFormatter.js  # Indian currency formatting
│   │   │   └── indianValidation.js   # Indian validation utilities
│   │   ├── App.js               # Main app component
│   │   └── index.js             # App entry point
│   ├── package.json             # Frontend dependencies
│   └── package-lock.json        # Frontend lock file
├── 📁 routes/                   # API route definitions
│   ├── analytics.js             # Analytics routes
│   ├── auth.js                  # Authentication routes
│   ├── menu.js                  # Menu routes
│   ├── orders.js                # Order routes
│   └── settings.js              # Settings routes
├── 📁 scripts/                  # Database utilities
│   ├── initializeSettings.js    # Initialize restaurant settings
│   └── seedData.js              # Seed sample data
├── 📁 services/                 # Business logic services
│   └── mockData.js              # Mock data for testing
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # License file
├── package.json                 # Backend dependencies
├── package-lock.json            # Backend lock file
├── README.md                    # This documentation
└── server.js                    # Express server entry point
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web application framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose 7.5.0** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Authentication and authorization
- **bcryptjs 2.4.3** - Password hashing
- **express-validator 7.0.1** - Input validation
- **cors 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment variable management
- **axios 1.9.0** - HTTP client

### Frontend
- **React 19.1.0** - Latest user interface library
- **Material-UI (MUI) 7.1.1** - Modern component library with Indian theme
- **@mui/icons-material** - Material Design icons
- **@mui/x-charts** - Advanced charting components
- **Axios** - HTTP client for API communication
- **React Router DOM 7.6.2** - Latest navigation library
- **Recharts** - Additional charting library for analytics

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

# Test menu categories
curl http://localhost:3000/api/menu/categories

# Test health check
curl http://localhost:3000/api/health
```
![Screenshot 2025-06-08 205625](https://github.com/user-attachments/assets/75546efb-e608-4ae2-a2ae-058832a788f8)

### Database Status
The database has been recently optimized:
- **Before Cleanup**: 64 menu items with 24 duplicate sets
- **After Cleanup**: 32 unique authentic Indian dishes
- **Categories**: 4 main categories (Appetizers, Main Course, Beverages, Desserts)
- **Price Range**: ₹39 - ₹479 (Average: ₹179.63)
- **All duplicates eliminated** for optimal performance

### System Validation
```bash
# Test MongoDB connection
node scripts/seedData.js

# Verify API endpoints
curl http://localhost:3000/api/menu
curl http://localhost:3000/api/menu/categories
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
# If using local MongoDB, check if it's running
mongod --version

# Start MongoDB service (for local installation)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# If using MongoDB Atlas (current setup), verify:
# 1. Internet connection
# 2. MongoDB Atlas cluster is running
# 3. IP address is whitelisted
# 4. Correct connection string in .env
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

### **CURRENT SYSTEM STATUS**

The Masai Bistro Restaurant Management System is fully functional with:

#### 🇮🇳 **Indian Localization Features**
- ✅ **Currency Formatting**: Complete ₹ (Indian Rupee) formatting with proper locale
- ✅ **Phone Validation**: Indian mobile number validation (+91 format)
- ✅ **Address Validation**: Indian postal code (PIN) and state validation
- ✅ **GST Integration**: 18% Goods and Services Tax calculation
- ✅ **Cultural Theming**: Saffron and deep red color scheme
- ✅ **Dietary Indicators**: Vegetarian/non-vegetarian symbols with spice levels

#### 🍛 **Database Status**
- ✅ **Menu Items**: 32 unique authentic Indian dishes (duplicates removed)
- ✅ **Categories**: Appetizers, Main Course, Beverages, Desserts
- ✅ **User Accounts**: Admin, Manager, and Staff roles configured
- ✅ **MongoDB Atlas**: Cloud database connected and optimized

#### 🛠️ **Technical Features**
- ✅ **Enhanced Menu Component**: Indian categories, dietary legends, cultural elements
- ✅ **Currency Utilities**: Comprehensive Indian currency formatting functions
- ✅ **Validation Utilities**: Indian phone, PIN code, and address validation
- ✅ **Dietary Components**: Vegetarian/vegan indicators with spice level displays
- ✅ **Material-UI Theme**: Indian restaurant colors and styling
- ✅ **Responsive Design**: Mobile-first approach with modern React patterns

#### 🚀 **Development Environment**
- ✅ **Backend Server**: Running on port 3000
- ✅ **Frontend Server**: Running on port 3002 (auto-assigned)
- ✅ **Database**: MongoDB Atlas cloud connection
- ✅ **Clean Codebase**: All test and debug files removed

### 🧹 **Recent Optimizations (Latest Update)**

**Database Cleanup Completed:**
- Removed 32 duplicate menu items (50% reduction: 64 → 32 items)
- Eliminated all duplicate dish names for optimal performance
- Maintained authentic Indian cuisine categories and pricing
- Preserved all essential functionality while improving efficiency

**Codebase Cleanup Completed:**
- Removed 29 temporary test and debug files
- Cleaned up 13 temporary report files
- Updated .gitignore to prevent future clutter
- Streamlined project structure for production readiness

### 🎯 **Ready for Production**

The system is fully functional, optimized, and ready for authentic Indian restaurant operations!

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ for Masai Bistro - Authentic Indian Restaurant Management**
