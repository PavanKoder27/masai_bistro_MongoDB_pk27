import React, { useState } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Keyframe animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 107, 53, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// Styled button with enhanced animations
const StyledAnimatedButton = styled(Button)(({ theme, animationType, isLoading }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Base hover effects
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    '&:not(:disabled)': {
      backgroundColor: theme.palette.primary.dark,
    }
  },

  // Active state
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },

  // Loading state
  ...(isLoading && {
    pointerEvents: 'none',
    opacity: 0.8,
  }),

  // Animation types
  ...(animationType === 'pulse' && {
    '&:hover': {
      animation: `${pulse} 1.5s infinite`,
    }
  }),

  ...(animationType === 'bounce' && {
    '&:hover': {
      animation: `${bounce} 1s ease-in-out`,
    }
  }),

  ...(animationType === 'shimmer' && {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.main} 70%)`,
    backgroundSize: '200px 100%',
    backgroundRepeat: 'no-repeat',
    '&:hover': {
      animation: `${shimmer} 2s infinite`,
    }
  }),

  // Ripple effect container
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s, height 0.6s',
  },

  '&:active::before': {
    width: '300px',
    height: '300px',
    animation: `${ripple} 0.6s ease-out`,
  },

  // Indian restaurant theme colors
  '&.MuiButton-containedPrimary': {
    background: 'linear-gradient(45deg, #ff6b35 30%, #f57c00 90%)',
    '&:hover': {
      background: 'linear-gradient(45deg, #e55a2b 30%, #ef6c00 90%)',
    }
  },

  '&.MuiButton-containedSecondary': {
    background: 'linear-gradient(45deg, #d32f2f 30%, #c62828 90%)',
    '&:hover': {
      background: 'linear-gradient(45deg, #c62828 30%, #b71c1c 90%)',
    }
  },

  // Success button for Indian theme
  '&.success': {
    background: 'linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
    }
  },

  // Warning button
  '&.warning': {
    background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #ef6c00 30%, #f57c00 90%)',
    }
  }
}));

// Loading spinner component
const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: 'white',
  marginRight: theme.spacing(1),
}));

/**
 * Enhanced Animated Button Component for Masai Bistro
 * Features smooth animations, loading states, and Indian restaurant theming
 */
const AnimatedButton = ({
  children,
  onClick,
  loading = false,
  animationType = 'default', // 'default', 'pulse', 'bounce', 'shimmer'
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  startIcon,
  endIcon,
  className = '',
  sx = {},
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async (event) => {
    if (loading || disabled) return;

    setIsClicked(true);
    
    // Add click animation
    setTimeout(() => setIsClicked(false), 200);

    if (onClick) {
      await onClick(event);
    }
  };

  return (
    <StyledAnimatedButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      animationType={animationType}
      isLoading={loading}
      className={`${className} ${isClicked ? 'clicked' : ''}`}
      startIcon={loading ? <LoadingSpinner size={16} /> : startIcon}
      endIcon={!loading ? endIcon : null}
      sx={{
        minWidth: loading ? '120px' : 'auto',
        ...sx
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {loading ? 'Loading...' : children}
      </Box>
    </StyledAnimatedButton>
  );
};

export default AnimatedButton;

// Preset button variants for common use cases
export const PrimaryAnimatedButton = (props) => (
  <AnimatedButton color="primary" animationType="shimmer" {...props} />
);

export const SecondaryAnimatedButton = (props) => (
  <AnimatedButton color="secondary" animationType="pulse" {...props} />
);

export const SuccessAnimatedButton = (props) => (
  <AnimatedButton className="success" animationType="bounce" {...props} />
);

export const WarningAnimatedButton = (props) => (
  <AnimatedButton className="warning" animationType="pulse" {...props} />
);

// Indian restaurant themed button
export const MasaiBistroButton = (props) => (
  <AnimatedButton
    color="primary"
    animationType="shimmer"
    sx={{
      fontWeight: 600,
      borderRadius: 2,
      textTransform: 'none',
      fontSize: '1rem',
      padding: '12px 24px',
      background: 'linear-gradient(45deg, #ff6b35 30%, #f57c00 90%)',
      '&:hover': {
        background: 'linear-gradient(45deg, #e55a2b 30%, #ef6c00 90%)',
        transform: 'translateY(-3px)',
        boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
      }
    }}
    {...props}
  />
);
