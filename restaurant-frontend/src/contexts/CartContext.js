import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { item, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(cartItem => cartItem._id === item._id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        newItems = state.items.map((cartItem, index) => 
          index === existingItemIndex 
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // New item, add to cart
        newItems = [...state.items, { ...item, quantity }];
      }
      
      const newState = {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalAmount: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
      
      // Save to localStorage
      localStorage.setItem('masai_bistro_cart', JSON.stringify(newState));
      return newState;
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const itemId = action.payload;
      const newItems = state.items.filter(item => item._id !== itemId);
      
      const newState = {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalAmount: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
      
      localStorage.setItem('masai_bistro_cart', JSON.stringify(newState));
      return newState;
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
      }
      
      const newItems = state.items.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      );
      
      const newState = {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalAmount: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
      
      localStorage.setItem('masai_bistro_cart', JSON.stringify(newState));
      return newState;
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      const newState = {
        items: [],
        totalItems: 0,
        totalAmount: 0
      };
      
      localStorage.setItem('masai_bistro_cart', JSON.stringify(newState));
      return newState;
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return action.payload;
    }
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('masai_bistro_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Cart actions
  const addToCart = (item, quantity = 1) => {
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { item, quantity } 
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: itemId 
    });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { itemId, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getItemQuantity = (itemId) => {
    const item = cart.items.find(item => item._id === itemId);
    return item ? item.quantity : 0;
  };

  const isItemInCart = (itemId) => {
    return cart.items.some(item => item._id === itemId);
  };

  // Calculate totals with GST
  const calculateTotals = () => {
    const subtotal = cart.totalAmount;
    const gst = subtotal * 0.18; // 18% GST
    const total = subtotal + gst;
    
    return {
      subtotal,
      gst,
      total,
      itemCount: cart.totalItems
    };
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
    calculateTotals
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
