require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Order = require('../models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const sampleMenuItems = [
  // Appetizers
  {
    name: "Vegetable Samosa",
    description: "Crispy triangular pastries filled with spiced potatoes and peas - a classic Indian street food",
    category: "appetizer",
    price: 149.00,
    ingredients: ["potatoes", "green peas", "cumin", "coriander", "pastry"],
    tags: ["vegetarian", "vegan", "popular"],
    isVegetarian: true,
    isVegan: true,
    spiceLevel: "mild",
    availability: true,
    preparationTime: 15,
    nutritionalInfo: {
      calories: 180,
      protein: 4,
      carbs: 28,
      fat: 6
    }
  },
  {
    name: "Paneer Tikka",
    description: "Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions",
    category: "appetizer",
    price: 299.00,
    ingredients: ["paneer", "yogurt", "bell peppers", "onions", "tandoori spices"],
    tags: ["vegetarian", "gluten-free", "popular"],
    isVegetarian: true,
    isVegan: false,
    spiceLevel: "medium",
    availability: true,
    preparationTime: 20,
    nutritionalInfo: {
      calories: 290,
      protein: 18,
      carbs: 8,
      fat: 20
    }
  },
  {
    name: "Chicken 65",
    description: "Spicy deep-fried chicken pieces with curry leaves and green chilies",
    category: "appetizer",
    price: 349.00,
    ingredients: ["chicken", "curry leaves", "green chilies", "ginger-garlic", "red chili powder"],
    tags: ["spicy", "gluten-free"],
    preparationTime: 18
  },
  {
    name: "Mixed Vegetable Pakora",
    description: "Assorted vegetables dipped in spiced gram flour batter and deep fried",
    category: "appetizer",
    price: 179.00,
    ingredients: ["onions", "potatoes", "spinach", "gram flour", "spices"],
    tags: ["vegetarian", "vegan"],
    preparationTime: 12
  },

  // Main Courses
  {
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato-based creamy curry with aromatic spices",
    category: "main_course",
    price: 449.00,
    ingredients: ["chicken", "tomatoes", "cream", "butter", "garam masala", "fenugreek"],
    tags: ["popular", "mild"],
    preparationTime: 25,
    nutritionalInfo: {
      calories: 420,
      protein: 32,
      carbs: 12,
      fat: 28
    }
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with spiced chicken and aromatic herbs",
    category: "main_course",
    price: 399.00,
    ingredients: ["basmati rice", "chicken", "saffron", "mint", "fried onions", "biryani spices"],
    tags: ["popular", "medium"],
    preparationTime: 35
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in rich tomato and cream gravy",
    category: "main_course",
    price: 279.00,
    ingredients: ["black lentils", "kidney beans", "tomatoes", "cream", "butter"],
    tags: ["vegetarian", "popular", "mild"],
    preparationTime: 30
  },
  {
    name: "Palak Paneer",
    description: "Fresh cottage cheese cubes in creamy spinach curry",
    category: "main_course",
    price: 329.00,
    ingredients: ["paneer", "spinach", "onions", "tomatoes", "cream", "spices"],
    tags: ["vegetarian", "gluten-free", "medium"],
    preparationTime: 22
  },
  {
    name: "Tandoori Chicken",
    description: "Marinated chicken roasted in traditional clay oven",
    category: "main_course",
    price: 479.00,
    ingredients: ["chicken", "yogurt", "tandoori spices", "lemon", "ginger-garlic"],
    tags: ["gluten-free", "medium"],
    preparationTime: 30
  },

  // Breads
  {
    name: "Butter Naan",
    description: "Soft leavened bread brushed with butter, baked in tandoor",
    category: "bread",
    price: 79.00,
    ingredients: ["refined flour", "yogurt", "butter", "baking powder"],
    tags: ["vegetarian"],
    preparationTime: 8
  },
  {
    name: "Garlic Naan",
    description: "Naan bread topped with fresh garlic and cilantro",
    category: "bread",
    price: 89.00,
    ingredients: ["refined flour", "garlic", "cilantro", "butter"],
    tags: ["vegetarian", "popular"],
    preparationTime: 10
  },
  {
    name: "Tandoori Roti",
    description: "Whole wheat bread cooked in tandoor oven",
    category: "bread",
    price: 49.00,
    ingredients: ["whole wheat flour", "water", "salt"],
    tags: ["vegetarian", "vegan"],
    preparationTime: 6
  },

  // Beverages
  {
    name: "Sweet Lassi",
    description: "Traditional yogurt-based drink sweetened with sugar",
    category: "beverage",
    price: 89.00,
    ingredients: ["yogurt", "sugar", "cardamom"],
    tags: ["vegetarian", "gluten-free"],
    preparationTime: 5
  },
  {
    name: "Masala Chai",
    description: "Spiced tea brewed with milk and aromatic spices",
    category: "beverage",
    price: 49.00,
    ingredients: ["tea leaves", "milk", "cardamom", "ginger", "cinnamon"],
    tags: ["vegetarian", "popular"],
    preparationTime: 8
  },
  {
    name: "Fresh Lime Water",
    description: "Refreshing lime juice with mint and black salt",
    category: "beverage",
    price: 69.00,
    ingredients: ["lime", "mint", "black salt", "sugar"],
    tags: ["vegan", "gluten-free"],
    preparationTime: 3
  },

  // Desserts
  {
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
    category: "dessert",
    price: 129.00,
    ingredients: ["milk powder", "flour", "sugar", "rose water", "cardamom"],
    tags: ["vegetarian", "popular"],
    preparationTime: 5
  },
  {
    name: "Kulfi",
    description: "Traditional Indian ice cream flavored with cardamom and pistachios",
    category: "dessert",
    price: 99.00,
    ingredients: ["milk", "sugar", "cardamom", "pistachios"],
    tags: ["vegetarian", "gluten-free"],
    preparationTime: 3
  }
];

const sampleUsers = [
  {
    username: "admin",
    email: "admin@masaibistro.com",
    password: "Admin123!",
    role: "admin",
    firstName: "Arjun",
    lastName: "Patel",
    phone: "+91-98765-43210"
  },
  {
    username: "manager1",
    email: "manager@masaibistro.com",
    password: "Manager123!",
    role: "manager",
    firstName: "Priya",
    lastName: "Sharma",
    phone: "+91-98765-43211"
  },
  {
    username: "staff1",
    email: "staff@masaibistro.com",
    password: "Staff123!",
    role: "staff",
    firstName: "Rahul",
    lastName: "Singh",
    phone: "+91-98765-43212"
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    
    console.log('Existing data cleared');

    // Insert menu items
    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`${menuItems.length} menu items created`);

    // Insert users one by one to trigger password hashing
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }
    console.log(`${users.length} users created`);

    // Create sample orders one by one to trigger pre-save middleware
    const order1 = new Order({
      customer: {
        name: "Rajesh Kumar",
        phone: "+919876543210",
        email: "rajesh.kumar@email.com"
      },
      items: [
        {
          menuItem: menuItems.find(item => item.name === "Butter Chicken")._id,
          quantity: 1,
          unitPrice: menuItems.find(item => item.name === "Butter Chicken").price,
          subtotal: menuItems.find(item => item.name === "Butter Chicken").price,
          specialInstructions: "Medium spice level please"
        },
        {
          menuItem: menuItems.find(item => item.name === "Chicken Biryani")._id,
          quantity: 1,
          unitPrice: menuItems.find(item => item.name === "Chicken Biryani").price,
          subtotal: menuItems.find(item => item.name === "Chicken Biryani").price,
          specialInstructions: "Extra raita on the side"
        },
        {
          menuItem: menuItems.find(item => item.name === "Garlic Naan")._id,
          quantity: 2,
          unitPrice: menuItems.find(item => item.name === "Garlic Naan").price,
          subtotal: menuItems.find(item => item.name === "Garlic Naan").price * 2
        },
        {
          menuItem: menuItems.find(item => item.name === "Sweet Lassi")._id,
          quantity: 2,
          unitPrice: menuItems.find(item => item.name === "Sweet Lassi").price,
          subtotal: menuItems.find(item => item.name === "Sweet Lassi").price * 2
        }
      ],
      orderType: "dine_in",
      tableNumber: 5,
      subtotal: 449 + 399 + (89 * 2) + (89 * 2), // Calculate based on Indian prices
      tax: (449 + 399 + (89 * 2) + (89 * 2)) * 0.18, // 18% GST for India
      total: (449 + 399 + (89 * 2) + (89 * 2)) * 1.18,
      paymentMethod: "card",
      paymentStatus: "paid",
      status: "delivered"
    });

    const order2 = new Order({
      customer: {
        name: "Priya Sharma",
        phone: "+919876543211",
        email: "priya.sharma@email.com"
      },
      items: [
        {
          menuItem: menuItems.find(item => item.name === "Palak Paneer")._id,
          quantity: 1,
          unitPrice: menuItems.find(item => item.name === "Palak Paneer").price,
          subtotal: menuItems.find(item => item.name === "Palak Paneer").price,
          specialInstructions: "Less spicy, extra paneer"
        },
        {
          menuItem: menuItems.find(item => item.name === "Dal Makhani")._id,
          quantity: 1,
          unitPrice: menuItems.find(item => item.name === "Dal Makhani").price,
          subtotal: menuItems.find(item => item.name === "Dal Makhani").price
        },
        {
          menuItem: menuItems.find(item => item.name === "Butter Naan")._id,
          quantity: 3,
          unitPrice: menuItems.find(item => item.name === "Butter Naan").price,
          subtotal: menuItems.find(item => item.name === "Butter Naan").price * 3
        },
        {
          menuItem: menuItems.find(item => item.name === "Masala Chai")._id,
          quantity: 1,
          unitPrice: menuItems.find(item => item.name === "Masala Chai").price,
          subtotal: menuItems.find(item => item.name === "Masala Chai").price
        }
      ],
      orderType: "takeout",
      subtotal: 329 + 279 + (79 * 3) + 49, // Calculate based on Indian prices
      tax: (329 + 279 + (79 * 3) + 49) * 0.18, // 18% GST for India
      total: (329 + 279 + (79 * 3) + 49) * 1.18,
      paymentMethod: "cash",
      paymentStatus: "paid",
      status: "ready"
    });

    await order1.save();
    await order2.save();
    const orders = [order1, order2];
    console.log(`${orders.length} orders created`);

    console.log('🎉 Masai Bistro sample data seeded successfully!');
    console.log('\n🔑 Login credentials for Masai Bistro:');
    console.log('👨‍💼 Admin: admin@masaibistro.com / Admin123!');
    console.log('👩‍💼 Manager: manager@masaibistro.com / Manager123!');
    console.log('👨‍🍳 Staff: staff@masaibistro.com / Staff123!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
connectDB().then(() => {
  seedData();
});

module.exports = { seedData };
