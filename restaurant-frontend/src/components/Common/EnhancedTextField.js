import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error,
  Warning,
  Email,
  Phone,
  Person,
  Lock,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components with Indian restaurant theme
const StyledTextField = styled(TextField)(({ theme, validationState }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },

    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.2)',
    },

    // Validation states
    ...(validationState === 'success' && {
      '& fieldset': {
        borderColor: '#2e7d32',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#1b5e20',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2e7d32',
        boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)',
      }
    }),

    ...(validationState === 'error' && {
      '& fieldset': {
        borderColor: '#d32f2f',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#c62828',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#d32f2f',
        boxShadow: '0 0 0 3px rgba(211, 47, 47, 0.1)',
      }
    }),

    ...(validationState === 'warning' && {
      '& fieldset': {
        borderColor: '#f57c00',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#ef6c00',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#f57c00',
        boxShadow: '0 0 0 3px rgba(245, 124, 0, 0.1)',
      }
    }),
  },

  // Label styling
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#ff6b35',
    }
  },
}));

const ValidationMessage = styled(Typography)(({ theme, type }) => ({
  marginTop: theme.spacing(0.5),
  marginLeft: theme.spacing(1.5),
  fontSize: '0.75rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  
  ...(type === 'error' && {
    color: '#d32f2f',
  }),
  
  ...(type === 'success' && {
    color: '#2e7d32',
  }),
  
  ...(type === 'warning' && {
    color: '#f57c00',
  }),
}));

// Validation functions
const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return { isValid: false, message: 'Email is required' };
    if (!emailRegex.test(value)) return { isValid: false, message: 'Please enter a valid email address' };
    return { isValid: true, message: 'Valid email address' };
  },

  password: (value) => {
    if (!value) return { isValid: false, message: 'Password is required' };
    if (value.length < 8) return { isValid: false, message: 'Password must be at least 8 characters' };
    if (!/(?=.*[a-z])/.test(value)) return { isValid: false, message: 'Password must contain lowercase letter' };
    if (!/(?=.*[A-Z])/.test(value)) return { isValid: false, message: 'Password must contain uppercase letter' };
    if (!/(?=.*\d)/.test(value)) return { isValid: false, message: 'Password must contain a number' };
    if (!/(?=.*[@$!%*?&])/.test(value)) return { isValid: false, message: 'Password must contain special character' };
    return { isValid: true, message: 'Strong password' };
  },

  phone: (value) => {
    const indianPhoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (!value) return { isValid: false, message: 'Phone number is required' };
    if (!indianPhoneRegex.test(value.replace(/\s+/g, ''))) {
      return { isValid: false, message: 'Please enter a valid Indian mobile number' };
    }
    return { isValid: true, message: 'Valid phone number' };
  },

  name: (value) => {
    if (!value) return { isValid: false, message: 'Name is required' };
    if (value.length < 2) return { isValid: false, message: 'Name must be at least 2 characters' };
    if (!/^[a-zA-Z\s]+$/.test(value)) return { isValid: false, message: 'Name can only contain letters and spaces' };
    return { isValid: true, message: 'Valid name' };
  },

  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return { isValid: false, message: 'This field is required' };
    }
    return { isValid: true, message: '' };
  },

  pincode: (value) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!value) return { isValid: false, message: 'PIN code is required' };
    if (!pincodeRegex.test(value)) return { isValid: false, message: 'Please enter a valid 6-digit PIN code' };
    return { isValid: true, message: 'Valid PIN code' };
  },
};

/**
 * Enhanced TextField with real-time validation and Indian localization
 */
const EnhancedTextField = ({
  label,
  value,
  onChange,
  onBlur,
  validationType,
  customValidator,
  showValidation = true,
  showSuccessMessage = true,
  type = 'text',
  placeholder,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  sx = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({ isValid: null, message: '' });
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  // Get appropriate icon for field type
  const getFieldIcon = () => {
    switch (validationType) {
      case 'email': return <Email />;
      case 'phone': return <Phone />;
      case 'name': return <Person />;
      case 'password': return <Lock />;
      default: return null;
    }
  };

  // Validate field value
  const validateField = (fieldValue) => {
    if (!showValidation) return { isValid: true, message: '' };

    // Custom validator takes precedence
    if (customValidator) {
      return customValidator(fieldValue);
    }

    // Use built-in validators
    if (validationType && validators[validationType]) {
      return validators[validationType](fieldValue);
    }

    // Default required validation
    if (required) {
      return validators.required(fieldValue);
    }

    return { isValid: true, message: '' };
  };

  // Real-time validation
  useEffect(() => {
    if (hasBeenTouched || value) {
      const result = validateField(value);
      setValidation(result);
    }
  }, [value, hasBeenTouched, validationType, required]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    onChange(event);
    
    // Trigger validation on change if field has been touched
    if (hasBeenTouched) {
      const result = validateField(newValue);
      setValidation(result);
    }
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    setHasBeenTouched(true);
    
    const result = validateField(value);
    setValidation(result);
    
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine validation state for styling
  const getValidationState = () => {
    if (!showValidation || !hasBeenTouched) return null;
    if (validation.isValid === true) return 'success';
    if (validation.isValid === false) return 'error';
    return null;
  };

  // Get validation icon
  const getValidationIcon = () => {
    const state = getValidationState();
    switch (state) {
      case 'success': return <CheckCircle sx={{ color: '#2e7d32', fontSize: 20 }} />;
      case 'error': return <Error sx={{ color: '#d32f2f', fontSize: 20 }} />;
      case 'warning': return <Warning sx={{ color: '#f57c00', fontSize: 20 }} />;
      default: return null;
    }
  };

  const fieldType = type === 'password' && showPassword ? 'text' : type;
  const validationState = getValidationState();

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <StyledTextField
        fullWidth
        label={label}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        type={fieldType}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        validationState={validationState}
        InputProps={{
          startAdornment: getFieldIcon() && (
            <InputAdornment position="start">
              {getFieldIcon()}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {type === 'password' && (
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )}
              {showValidation && hasBeenTouched && (
                <Zoom in={true}>
                  <Box>{getValidationIcon()}</Box>
                </Zoom>
              )}
            </InputAdornment>
          ),
        }}
        {...props}
      />
      
      {/* Validation Message */}
      {showValidation && hasBeenTouched && validation.message && (
        <Fade in={true}>
          <ValidationMessage type={validationState}>
            {validation.message}
          </ValidationMessage>
        </Fade>
      )}
      
      {/* Helper Text */}
      {helperText && !validation.message && (
        <Typography variant="caption" sx={{ ml: 1.5, mt: 0.5, color: 'text.secondary' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default EnhancedTextField;
