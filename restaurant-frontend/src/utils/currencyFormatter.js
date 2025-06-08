/**
 * Indian Currency Formatting Utilities for Masai Bistro
 * Handles Indian Rupee (₹) formatting with proper localization
 */

/**
 * Format amount in Indian Rupees with proper locale formatting
 * @param {number} amount - The amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    locale = 'en-IN',
    currency = 'INR',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true
  } = options;

  if (typeof amount !== 'number' || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits
    });

    return formatter.format(amount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    const formattedAmount = amount.toFixed(maximumFractionDigits);
    return showSymbol ? `₹${formattedAmount}` : formattedAmount;
  }
};

/**
 * Format amount with Indian number system (lakhs, crores)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted amount with Indian number system
 */
export const formatIndianNumber = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount);
  }
};

/**
 * Calculate GST (Goods and Services Tax) for Indian pricing
 * @param {number} amount - Base amount
 * @param {number} gstRate - GST rate (default 18%)
 * @returns {object} Object with base amount, GST amount, and total
 */
export const calculateGST = (amount, gstRate = 18) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { baseAmount: 0, gstAmount: 0, total: 0 };
  }

  const gstAmount = (amount * gstRate) / 100;
  const total = amount + gstAmount;

  return {
    baseAmount: Math.round(amount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    gstRate
  };
};

/**
 * Format price for menu display with Indian styling
 * @param {number} price - The price to format
 * @param {boolean} showGST - Whether to show "incl. GST" text
 * @returns {string} Formatted price string
 */
export const formatMenuPrice = (price, showGST = true) => {
  const formattedPrice = formatCurrency(price);
  return showGST ? `${formattedPrice} (incl. GST)` : formattedPrice;
};

/**
 * Parse Indian currency string back to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString !== 'string') {
    return 0;
  }

  // Remove currency symbols and spaces
  const cleanString = currencyString
    .replace(/[₹,\s]/g, '')
    .replace(/[^\d.-]/g, '');

  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format order total with breakdown
 * @param {object} orderData - Order data with items
 * @param {number} gstRate - GST rate
 * @returns {object} Formatted order totals
 */
export const formatOrderTotal = (orderData, gstRate = 18) => {
  const subtotal = orderData.items?.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0) || 0;

  const gstCalculation = calculateGST(subtotal, gstRate);
  
  return {
    subtotal: formatCurrency(gstCalculation.baseAmount),
    gstAmount: formatCurrency(gstCalculation.gstAmount),
    total: formatCurrency(gstCalculation.total),
    gstRate: `${gstRate}%`,
    rawSubtotal: gstCalculation.baseAmount,
    rawGstAmount: gstCalculation.gstAmount,
    rawTotal: gstCalculation.total
  };
};

/**
 * Validate Indian price format
 * @param {string} priceString - Price string to validate
 * @returns {boolean} Whether the price format is valid
 */
export const validatePriceFormat = (priceString) => {
  if (typeof priceString !== 'string') {
    return false;
  }

  // Indian price pattern: ₹123 or ₹1,234 or ₹12,345
  const indianPricePattern = /^₹?\s*\d{1,3}(,\d{3})*(\.\d{1,2})?$/;
  return indianPricePattern.test(priceString.trim());
};

// Export default formatCurrency for convenience
export default formatCurrency;
