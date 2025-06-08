/**
 * Indian Localization Validation Utilities for Masai Bistro
 * Handles Indian phone numbers, PIN codes, and address formats
 */

/**
 * Validate Indian mobile number
 * Supports formats: +91-XXXXX-XXXXX, +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export const validateIndianPhone = (phoneNumber) => {
  if (typeof phoneNumber !== 'string') {
    return false;
  }

  // Remove all spaces, hyphens, and parentheses
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Indian mobile number patterns
  const patterns = [
    /^\+91[6-9]\d{9}$/, // +91XXXXXXXXXX (starts with 6-9)
    /^91[6-9]\d{9}$/,   // 91XXXXXXXXXX (starts with 6-9)
    /^[6-9]\d{9}$/      // XXXXXXXXXX (starts with 6-9)
  ];

  return patterns.some(pattern => pattern.test(cleanPhone));
};

/**
 * Format Indian phone number to standard format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatIndianPhone = (phoneNumber) => {
  if (!validateIndianPhone(phoneNumber)) {
    return phoneNumber; // Return as-is if invalid
  }

  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.startsWith('+91')) {
    const number = cleanPhone.substring(3);
    return `+91-${number.substring(0, 5)}-${number.substring(5)}`;
  } else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    const number = cleanPhone.substring(2);
    return `+91-${number.substring(0, 5)}-${number.substring(5)}`;
  } else if (cleanPhone.length === 10) {
    return `+91-${cleanPhone.substring(0, 5)}-${cleanPhone.substring(5)}`;
  }
  
  return phoneNumber;
};

/**
 * Validate Indian PIN code (6 digits)
 * @param {string} pinCode - PIN code to validate
 * @returns {boolean} Whether the PIN code is valid
 */
export const validateIndianPinCode = (pinCode) => {
  if (typeof pinCode !== 'string') {
    return false;
  }

  // Indian PIN code pattern: 6 digits, first digit cannot be 0
  const pinPattern = /^[1-9]\d{5}$/;
  return pinPattern.test(pinCode.trim());
};

/**
 * Validate Indian state name
 * @param {string} state - State name to validate
 * @returns {boolean} Whether the state is valid
 */
export const validateIndianState = (state) => {
  if (typeof state !== 'string') {
    return false;
  }

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  return indianStates.some(validState => 
    validState.toLowerCase() === state.trim().toLowerCase()
  );
};

/**
 * Get list of Indian states and union territories
 * @returns {Array} Array of Indian states
 */
export const getIndianStates = () => {
  return [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ].sort();
};

/**
 * Validate complete Indian address
 * @param {object} address - Address object to validate
 * @returns {object} Validation result with errors
 */
export const validateIndianAddress = (address) => {
  const errors = {};

  if (!address.street || address.street.trim().length < 5) {
    errors.street = 'Street address must be at least 5 characters long';
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.city = 'City name is required';
  }

  if (!validateIndianState(address.state)) {
    errors.state = 'Please select a valid Indian state';
  }

  if (!validateIndianPinCode(address.postalCode)) {
    errors.postalCode = 'Please enter a valid 6-digit PIN code';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format Indian address for display
 * @param {object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatIndianAddress = (address) => {
  if (!address) return '';

  const parts = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country || 'India'
  ].filter(part => part && part.trim());

  return parts.join(', ');
};

/**
 * Validate Indian restaurant name
 * @param {string} name - Restaurant name to validate
 * @returns {boolean} Whether the name is valid
 */
export const validateRestaurantName = (name) => {
  if (typeof name !== 'string') {
    return false;
  }

  // Restaurant name should be 2-100 characters, allow letters, numbers, spaces, and common symbols
  const namePattern = /^[a-zA-Z0-9\s\-&'.,()]{2,100}$/;
  return namePattern.test(name.trim());
};

/**
 * Validate Indian person name
 * @param {string} name - Person name to validate
 * @returns {boolean} Whether the name is valid
 */
export const validateIndianName = (name) => {
  if (typeof name !== 'string') {
    return false;
  }

  // Indian names can contain letters, spaces, dots, and apostrophes
  const namePattern = /^[a-zA-Z\s.']{2,50}$/;
  return namePattern.test(name.trim());
};

/**
 * Validate email with Indian domain preference
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const validateEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim().toLowerCase());
};

/**
 * Get Indian time zone
 * @returns {string} Indian Standard Time zone
 */
export const getIndianTimeZone = () => {
  return 'Asia/Kolkata';
};

/**
 * Format date in Indian format (DD/MM/YYYY)
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatIndianDate = (date) => {
  if (!(date instanceof Date)) {
    return '';
  }

  return date.toLocaleDateString('en-IN', {
    timeZone: getIndianTimeZone(),
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format time in Indian format (12-hour with AM/PM)
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatIndianTime = (date) => {
  if (!(date instanceof Date)) {
    return '';
  }

  return date.toLocaleTimeString('en-IN', {
    timeZone: getIndianTimeZone(),
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export default {
  validateIndianPhone,
  formatIndianPhone,
  validateIndianPinCode,
  validateIndianState,
  getIndianStates,
  validateIndianAddress,
  formatIndianAddress,
  validateRestaurantName,
  validateIndianName,
  validateEmail,
  getIndianTimeZone,
  formatIndianDate,
  formatIndianTime
};
