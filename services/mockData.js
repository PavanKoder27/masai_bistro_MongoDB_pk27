/**
 * Mock Data Service for Masai Bistro
 * Provides sample data when database is not available
 */

const mockMenuItems = [
  // APPETIZERS & STARTERS
  {
    _id: '1',
    name: 'Samosa Chaat',
    description: 'Crispy samosas topped with tangy chutneys, yogurt, and sev',
    price: 95,
    category: 'appetizer',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'medium',
    ingredients: ['samosa', 'mint chutney', 'tamarind chutney', 'yogurt', 'onion', 'sev', 'coriander'],
    preparationTime: 10,
    isAvailable: true,
    tags: ['vegetarian', 'street-food', 'popular', 'chaat'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '2',
    name: 'Chicken Tikka',
    description: 'Succulent chicken pieces marinated in yogurt and spices, grilled in tandoor',
    price: 285,
    category: 'appetizer',
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'hot',
    ingredients: ['chicken', 'yogurt', 'ginger-garlic paste', 'red chili powder', 'garam masala', 'lemon juice'],
    preparationTime: 20,
    isAvailable: true,
    tags: ['tandoori', 'signature', 'popular'],
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '3',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled with bell peppers and onions',
    price: 245,
    category: 'appetizer',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'medium',
    ingredients: ['paneer', 'bell peppers', 'onion', 'yogurt', 'tandoori masala', 'mint chutney'],
    preparationTime: 18,
    isAvailable: true,
    tags: ['vegetarian', 'tandoori', 'popular'],
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '4',
    name: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe filled with spiced potato curry',
    price: 125,
    category: 'appetizer',
    isVegetarian: true,
    isVegan: true,
    spiceLevel: 'mild',
    ingredients: ['rice', 'urad dal', 'potato', 'onion', 'mustard seeds', 'curry leaves', 'turmeric'],
    preparationTime: 15,
    isAvailable: true,
    tags: ['vegetarian', 'vegan', 'south-indian', 'street-food'],
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '5',
    name: 'Aloo Tikki Chaat',
    description: 'Crispy potato patties topped with chutneys, yogurt, and pomegranate',
    price: 85,
    category: 'appetizer',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'medium',
    ingredients: ['potato', 'green peas', 'mint chutney', 'tamarind chutney', 'yogurt', 'pomegranate', 'sev'],
    preparationTime: 12,
    isAvailable: true,
    tags: ['vegetarian', 'street-food', 'chaat'],
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&crop=center'
  },

  // MAIN COURSES
  {
    _id: '6',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato and butter sauce with aromatic spices',
    price: 345,
    category: 'main_course',
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'medium',
    ingredients: ['chicken', 'tomato', 'butter', 'cream', 'fenugreek', 'garam masala', 'ginger-garlic'],
    preparationTime: 25,
    isAvailable: true,
    tags: ['popular', 'creamy', 'signature'],
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '7',
    name: 'Paneer Makhani',
    description: 'Cottage cheese in velvety tomato and cashew gravy',
    price: 295,
    category: 'main_course',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    ingredients: ['paneer', 'tomato', 'cashews', 'cream', 'butter', 'fenugreek', 'garam masala'],
    preparationTime: 20,
    isAvailable: true,
    tags: ['vegetarian', 'popular', 'creamy'],
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '8',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice layered with spiced chicken and saffron',
    price: 385,
    category: 'main_course',
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'hot',
    ingredients: ['basmati rice', 'chicken', 'saffron', 'yogurt', 'fried onions', 'mint', 'biryani masala'],
    preparationTime: 45,
    isAvailable: true,
    tags: ['signature', 'popular', 'biryani'],
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '9',
    name: 'Mutton Rogan Josh',
    description: 'Tender mutton cooked in aromatic Kashmiri spices and yogurt',
    price: 425,
    category: 'main_course',
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'hot',
    ingredients: ['mutton', 'yogurt', 'kashmiri red chili', 'fennel powder', 'ginger', 'garlic', 'onion'],
    preparationTime: 60,
    isAvailable: true,
    tags: ['signature', 'kashmiri', 'spicy'],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '10',
    name: 'Tandoori Chicken',
    description: 'Half chicken marinated in yogurt and spices, roasted in clay oven',
    price: 395,
    category: 'main_course',
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'hot',
    ingredients: ['chicken', 'yogurt', 'tandoori masala', 'lemon juice', 'ginger-garlic paste', 'red chili'],
    preparationTime: 35,
    isAvailable: true,
    tags: ['tandoori', 'signature', 'grilled'],
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '11',
    name: 'Palak Paneer',
    description: 'Fresh cottage cheese in creamy spinach gravy with Indian spices',
    price: 275,
    category: 'main_course',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    ingredients: ['paneer', 'spinach', 'onion', 'tomato', 'cream', 'garam masala', 'cumin'],
    preparationTime: 22,
    isAvailable: true,
    tags: ['vegetarian', 'healthy', 'popular'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '12',
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice with mixed vegetables and aromatic spices',
    price: 285,
    category: 'main_course',
    isVegetarian: true,
    isVegan: true,
    spiceLevel: 'medium',
    ingredients: ['basmati rice', 'mixed vegetables', 'saffron', 'mint', 'fried onions', 'biryani masala'],
    preparationTime: 40,
    isAvailable: true,
    tags: ['vegetarian', 'vegan', 'biryani', 'healthy'],
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '13',
    name: 'Fish Curry',
    description: 'Fresh fish cooked in coconut milk with South Indian spices',
    price: 365,
    category: 'main_course',
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 'hot',
    ingredients: ['fish', 'coconut milk', 'curry leaves', 'mustard seeds', 'tamarind', 'red chili', 'turmeric'],
    preparationTime: 25,
    isAvailable: true,
    tags: ['south-indian', 'seafood', 'coconut'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '14',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in rich tomato and butter gravy',
    price: 225,
    category: 'main_course',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    ingredients: ['black lentils', 'kidney beans', 'tomato', 'butter', 'cream', 'ginger-garlic', 'garam masala'],
    preparationTime: 30,
    isAvailable: true,
    tags: ['vegetarian', 'popular', 'creamy', 'comfort-food'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center'
  },

  // INDIAN BREADS
  {
    _id: '15',
    name: 'Butter Naan',
    description: 'Soft leavened bread brushed with butter, baked in tandoor',
    price: 55,
    category: 'bread',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['flour', 'yogurt', 'yeast', 'butter', 'salt', 'sugar'],
    preparationTime: 12,
    isAvailable: true,
    tags: ['tandoori', 'popular'],
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '16',
    name: 'Garlic Naan',
    description: 'Tandoor-baked bread topped with fresh garlic and coriander',
    price: 65,
    category: 'bread',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    ingredients: ['flour', 'yogurt', 'yeast', 'garlic', 'coriander', 'butter'],
    preparationTime: 12,
    isAvailable: true,
    tags: ['tandoori', 'garlic', 'popular'],
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '17',
    name: 'Cheese Naan',
    description: 'Naan stuffed with melted cheese and herbs',
    price: 85,
    category: 'bread',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['flour', 'yogurt', 'cheese', 'herbs', 'butter'],
    preparationTime: 15,
    isAvailable: true,
    tags: ['tandoori', 'cheese', 'stuffed'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '18',
    name: 'Tandoori Roti',
    description: 'Whole wheat bread cooked in clay oven',
    price: 35,
    category: 'bread',
    isVegetarian: true,
    isVegan: true,
    spiceLevel: 'none',
    ingredients: ['whole wheat flour', 'water', 'salt'],
    preparationTime: 10,
    isAvailable: true,
    tags: ['tandoori', 'healthy', 'vegan'],
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '19',
    name: 'Kulcha',
    description: 'Leavened bread stuffed with spiced onions',
    price: 75,
    category: 'bread',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    ingredients: ['flour', 'yogurt', 'onion', 'coriander', 'cumin seeds', 'green chili'],
    preparationTime: 15,
    isAvailable: true,
    tags: ['tandoori', 'stuffed', 'onion'],
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&crop=center'
  },

  // BEVERAGES
  {
    _id: '20',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink blended with sweet mango pulp',
    price: 95,
    category: 'beverage',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['mango pulp', 'yogurt', 'sugar', 'cardamom', 'ice'],
    preparationTime: 5,
    isAvailable: true,
    tags: ['refreshing', 'popular', 'sweet', 'mango'],
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '21',
    name: 'Sweet Lassi',
    description: 'Traditional yogurt drink sweetened with sugar and cardamom',
    price: 75,
    category: 'beverage',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['yogurt', 'sugar', 'cardamom', 'rose water', 'ice'],
    preparationTime: 5,
    isAvailable: true,
    tags: ['refreshing', 'traditional', 'sweet'],
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '22',
    name: 'Masala Chai',
    description: 'Spiced tea brewed with cardamom, ginger, and aromatic spices',
    price: 45,
    category: 'beverage',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'mild',
    ingredients: ['tea leaves', 'milk', 'sugar', 'cardamom', 'ginger', 'cinnamon', 'cloves'],
    preparationTime: 8,
    isAvailable: true,
    tags: ['hot', 'spiced', 'traditional', 'popular'],
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '23',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with soda water and mint',
    price: 65,
    category: 'beverage',
    isVegetarian: true,
    isVegan: true,
    spiceLevel: 'none',
    ingredients: ['fresh lime', 'soda water', 'mint', 'black salt', 'sugar'],
    preparationTime: 3,
    isAvailable: true,
    tags: ['refreshing', 'citrus', 'vegan', 'cold'],
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '24',
    name: 'Thandai',
    description: 'Traditional milk drink with almonds, pistachios, and aromatic spices',
    price: 125,
    category: 'beverage',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['milk', 'almonds', 'pistachios', 'cardamom', 'saffron', 'rose petals', 'sugar'],
    preparationTime: 10,
    isAvailable: true,
    tags: ['traditional', 'festive', 'nuts', 'rich'],
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center'
  },

  // DESSERTS
  {
    _id: '25',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in cardamom-flavored sugar syrup',
    price: 85,
    category: 'dessert',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['milk powder', 'flour', 'ghee', 'sugar', 'cardamom', 'rose water'],
    preparationTime: 20,
    isAvailable: true,
    tags: ['sweet', 'popular', 'traditional'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '26',
    name: 'Ras Malai',
    description: 'Soft cottage cheese dumplings in sweetened, thickened milk',
    price: 105,
    category: 'dessert',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['paneer', 'milk', 'sugar', 'cardamom', 'pistachios', 'almonds'],
    preparationTime: 25,
    isAvailable: true,
    tags: ['sweet', 'creamy', 'nuts', 'popular'],
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '27',
    name: 'Kulfi',
    description: 'Traditional Indian ice cream with cardamom and pistachios',
    price: 75,
    category: 'dessert',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['milk', 'sugar', 'cardamom', 'pistachios', 'almonds'],
    preparationTime: 5,
    isAvailable: true,
    tags: ['cold', 'creamy', 'traditional', 'nuts'],
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '28',
    name: 'Jalebi',
    description: 'Crispy spiral-shaped sweet soaked in saffron sugar syrup',
    price: 65,
    category: 'dessert',
    isVegetarian: true,
    isVegan: true,
    spiceLevel: 'none',
    ingredients: ['flour', 'yogurt', 'sugar', 'saffron', 'cardamom', 'oil'],
    preparationTime: 15,
    isAvailable: true,
    tags: ['sweet', 'crispy', 'traditional', 'vegan'],
    image: 'https://images.unsplash.com/photo-1606471191009-63a0b5ba4e0f?w=400&h=300&fit=crop&crop=center'
  },
  {
    _id: '29',
    name: 'Kheer',
    description: 'Creamy rice pudding with cardamom, nuts, and saffron',
    price: 95,
    category: 'dessert',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'none',
    ingredients: ['basmati rice', 'milk', 'sugar', 'cardamom', 'almonds', 'pistachios', 'saffron'],
    preparationTime: 30,
    isAvailable: true,
    tags: ['sweet', 'creamy', 'traditional', 'nuts'],
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&crop=center'
  }
];

const mockUsers = [
  {
    _id: 'admin1',
    username: 'admin',
    email: 'admin@masaibistro.com',
    firstName: 'Arjun',
    lastName: 'Patel',
    role: 'admin',
    phone: '+91-98765-43210',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01')
  },
  {
    _id: 'manager1',
    username: 'manager',
    email: 'manager@masaibistro.com',
    firstName: 'Priya',
    lastName: 'Sharma',
    role: 'manager',
    phone: '+91-98765-43211',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01')
  },
  {
    _id: 'staff1',
    username: 'staff',
    email: 'staff@masaibistro.com',
    firstName: 'Rahul',
    lastName: 'Singh',
    role: 'staff',
    phone: '+91-98765-43212',
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01')
  }
];

const mockOrders = [
  {
    _id: 'order1',
    orderNumber: 'MB001',
    customer: {
      name: 'Rajesh Kumar',
      phone: '+91-98765-12345',
      email: 'rajesh.kumar@gmail.com'
    },
    items: [
      {
        menuItem: mockMenuItems[0], // Samosa Chaat
        quantity: 2,
        price: 95,
        subtotal: 190
      },
      {
        menuItem: mockMenuItems[6], // Paneer Makhani
        quantity: 1,
        price: 285,
        subtotal: 285
      },
      {
        menuItem: mockMenuItems[15], // Butter Naan
        quantity: 3,
        price: 55,
        subtotal: 165
      }
    ],
    subtotal: 640,
    tax: 115.20, // 18% GST
    total: 755.20,
    orderType: 'dine_in',
    tableNumber: 12,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    specialInstructions: 'Medium spice level for Paneer Makhani',
    createdAt: new Date('2024-12-08T10:30:00'),
    updatedAt: new Date('2024-12-08T11:45:00'),
    estimatedTime: 25,
    actualTime: 28
  },
  {
    _id: 'order2',
    orderNumber: 'MB002',
    customer: {
      name: 'Priya Sharma',
      phone: '+91-98765-54321',
      email: 'priya.sharma@yahoo.com'
    },
    items: [
      {
        menuItem: mockMenuItems[7], // Chicken Biryani
        quantity: 1,
        price: 325,
        subtotal: 325
      },
      {
        menuItem: mockMenuItems[20], // Mango Lassi
        quantity: 2,
        price: 95,
        subtotal: 190
      }
    ],
    subtotal: 515,
    tax: 92.70,
    total: 607.70,
    orderType: 'takeout',
    status: 'ready',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    specialInstructions: 'Extra raita with biryani',
    createdAt: new Date('2024-12-08T12:15:00'),
    updatedAt: new Date('2024-12-08T12:45:00'),
    estimatedTime: 35,
    actualTime: null
  },
  {
    _id: 'order3',
    orderNumber: 'MB003',
    customer: {
      name: 'Amit Patel',
      phone: '+91-98765-67890',
      email: 'amit.patel@hotmail.com'
    },
    items: [
      {
        menuItem: mockMenuItems[5], // Butter Chicken
        quantity: 2,
        price: 320,
        subtotal: 640
      },
      {
        menuItem: mockMenuItems[16], // Garlic Naan
        quantity: 4,
        price: 65,
        subtotal: 260
      },
      {
        menuItem: mockMenuItems[25], // Gulab Jamun
        quantity: 1,
        price: 85,
        subtotal: 85
      }
    ],
    subtotal: 985,
    tax: 177.30,
    total: 1162.30,
    orderType: 'delivery',
    deliveryAddress: {
      street: '123 MG Road',
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034'
    },
    status: 'in_preparation',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    specialInstructions: 'Call before delivery, gate code 1234',
    createdAt: new Date('2024-12-08T13:20:00'),
    updatedAt: new Date('2024-12-08T13:25:00'),
    estimatedTime: 45,
    actualTime: null
  },
  {
    _id: 'order4',
    orderNumber: 'MB004',
    customer: {
      name: 'Sneha Reddy',
      phone: '+91-98765-11111',
      email: 'sneha.reddy@gmail.com'
    },
    items: [
      {
        menuItem: mockMenuItems[3], // Masala Dosa
        quantity: 2,
        price: 125,
        subtotal: 250
      },
      {
        menuItem: mockMenuItems[22], // Masala Chai
        quantity: 2,
        price: 45,
        subtotal: 90
      }
    ],
    subtotal: 340,
    tax: 61.20,
    total: 401.20,
    orderType: 'dine_in',
    tableNumber: 8,
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    specialInstructions: 'Extra sambar and chutney',
    createdAt: new Date('2024-12-08T14:10:00'),
    updatedAt: new Date('2024-12-08T14:12:00'),
    estimatedTime: 20,
    actualTime: null
  },
  {
    _id: 'order5',
    orderNumber: 'MB005',
    customer: {
      name: 'Vikram Singh',
      phone: '+91-98765-22222',
      email: 'vikram.singh@outlook.com'
    },
    items: [
      {
        menuItem: mockMenuItems[9], // Tandoori Chicken
        quantity: 1,
        price: 385,
        subtotal: 385
      },
      {
        menuItem: mockMenuItems[11], // Vegetable Biryani
        quantity: 1,
        price: 275,
        subtotal: 275
      },
      {
        menuItem: mockMenuItems[18], // Tandoori Roti
        quantity: 4,
        price: 35,
        subtotal: 140
      },
      {
        menuItem: mockMenuItems[27], // Kulfi
        quantity: 2,
        price: 75,
        subtotal: 150
      }
    ],
    subtotal: 950,
    tax: 171.00,
    total: 1121.00,
    orderType: 'dine_in',
    tableNumber: 15,
    status: 'placed',
    paymentStatus: 'pending',
    paymentMethod: 'card',
    specialInstructions: 'Birthday celebration - please add candle to kulfi',
    createdAt: new Date('2024-12-08T15:30:00'),
    updatedAt: new Date('2024-12-08T15:30:00'),
    estimatedTime: 40,
    actualTime: null
  },
  {
    _id: 'order6',
    orderNumber: 'MB006',
    customer: {
      name: 'Kavya Nair',
      phone: '+91-98765-33333',
      email: 'kavya.nair@gmail.com'
    },
    items: [
      {
        menuItem: mockMenuItems[10], // Palak Paneer
        quantity: 1,
        price: 265,
        subtotal: 265
      },
      {
        menuItem: mockMenuItems[13], // Dal Makhani
        quantity: 1,
        price: 225,
        subtotal: 225
      },
      {
        menuItem: mockMenuItems[17], // Cheese Naan
        quantity: 2,
        price: 85,
        subtotal: 170
      }
    ],
    subtotal: 660,
    tax: 118.80,
    total: 778.80,
    orderType: 'takeout',
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'upi',
    specialInstructions: 'Customer cancelled due to emergency',
    createdAt: new Date('2024-12-08T16:00:00'),
    updatedAt: new Date('2024-12-08T16:15:00'),
    estimatedTime: 30,
    actualTime: null,
    cancellationReason: 'Customer emergency'
  }
];

const mockCategories = ['appetizer', 'main_course', 'bread', 'beverage', 'dessert'];

const mockSettings = {
  restaurantName: 'Masai Bistro',
  address: 'Brigade Road, Bangalore, Karnataka - 560025',
  phone: '+91-80-4567-8900',
  email: 'info@masaibistro.com',
  currency: 'INR',
  taxRate: 18,
  timezone: 'Asia/Kolkata'
};

// Mock revenue data for dashboard
const mockRevenueData = {
  dailyRevenue: [
    { date: '2024-12-01', revenue: 15420.50, orders: 45 },
    { date: '2024-12-02', revenue: 18750.25, orders: 52 },
    { date: '2024-12-03', revenue: 22100.75, orders: 61 },
    { date: '2024-12-04', revenue: 19850.00, orders: 48 },
    { date: '2024-12-05', revenue: 25600.80, orders: 67 },
    { date: '2024-12-06', revenue: 28900.45, orders: 73 },
    { date: '2024-12-07', revenue: 31250.90, orders: 82 },
    { date: '2024-12-08', revenue: 12750.30, orders: 35 } // Today (partial)
  ],
  monthlyRevenue: [
    { month: 'Jan 2024', revenue: 485600.75, orders: 1420 },
    { month: 'Feb 2024', revenue: 512300.50, orders: 1580 },
    { month: 'Mar 2024', revenue: 598750.25, orders: 1750 },
    { month: 'Apr 2024', revenue: 645200.80, orders: 1890 },
    { month: 'May 2024', revenue: 678900.45, orders: 1965 },
    { month: 'Jun 2024', revenue: 725600.90, orders: 2120 },
    { month: 'Jul 2024', revenue: 789450.75, orders: 2285 },
    { month: 'Aug 2024', revenue: 812300.60, orders: 2340 },
    { month: 'Sep 2024', revenue: 856700.25, orders: 2450 },
    { month: 'Oct 2024', revenue: 892150.80, orders: 2580 },
    { month: 'Nov 2024', revenue: 925600.45, orders: 2675 },
    { month: 'Dec 2024', revenue: 154772.95, orders: 418 } // Current month (partial)
  ],
  topSellingItems: [
    { name: 'Butter Chicken', quantity: 156, revenue: 53820.00 },
    { name: 'Chicken Biryani', quantity: 142, revenue: 54670.00 },
    { name: 'Paneer Makhani', quantity: 128, revenue: 37760.00 },
    { name: 'Garlic Naan', quantity: 245, revenue: 15925.00 },
    { name: 'Tandoori Chicken', quantity: 98, revenue: 38710.00 }
  ],
  categoryRevenue: [
    { category: 'Main Course', revenue: 285600.75, percentage: 62.5 },
    { category: 'Appetizers', revenue: 89450.25, percentage: 19.6 },
    { category: 'Beverages', revenue: 45780.50, percentage: 10.0 },
    { category: 'Desserts', revenue: 25890.30, percentage: 5.7 },
    { category: 'Indian Breads', revenue: 10050.15, percentage: 2.2 }
  ],
  currentMonthStats: {
    totalRevenue: 154772.95,
    totalOrders: 418,
    averageOrderValue: 370.45,
    gstCollected: 27859.13,
    netRevenue: 126913.82
  }
};

module.exports = {
  mockMenuItems,
  mockUsers,
  mockOrders,
  mockCategories,
  mockSettings,
  mockRevenueData
};
