import React from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import {
  Circle as VegIcon,
  RadioButtonUnchecked as NonVegIcon,
  LocalFireDepartment as SpiceIcon,
  Spa as VeganIcon
} from '@mui/icons-material';

/**
 * Indian Dietary Indicators Component for Masai Bistro
 * Displays vegetarian/non-vegetarian symbols and spice levels according to Indian standards
 */

const DietaryIndicators = ({ 
  item, 
  showSpiceLevel = true, 
  showVeganIndicator = true,
  size = 'medium',
  variant = 'outlined' 
}) => {
  // Get vegetarian indicator color and icon
  const getVegIndicator = () => {
    if (item.isVegetarian) {
      return {
        icon: <VegIcon sx={{ color: '#2e7d32', fontSize: size === 'small' ? 16 : 20 }} />,
        tooltip: 'Vegetarian',
        color: 'success'
      };
    } else {
      return {
        icon: <NonVegIcon sx={{ color: '#c62828', fontSize: size === 'small' ? 16 : 20 }} />,
        tooltip: 'Non-Vegetarian',
        color: 'error'
      };
    }
  };

  // Get spice level indicator
  const getSpiceIndicator = () => {
    const spiceLevel = item.spiceLevel || 'mild';
    
    const spiceConfig = {
      mild: {
        color: '#2e7d32',
        label: 'Mild',
        icon: '🌿',
        chipColor: 'success'
      },
      medium: {
        color: '#f57c00',
        label: 'Medium',
        icon: '🌶️',
        chipColor: 'warning'
      },
      hot: {
        color: '#d84315',
        label: 'Hot',
        icon: '🔥',
        chipColor: 'error'
      },
      very_hot: {
        color: '#b71c1c',
        label: 'Very Hot',
        icon: '🔥🔥',
        chipColor: 'error'
      }
    };

    return spiceConfig[spiceLevel] || spiceConfig.mild;
  };

  const vegIndicator = getVegIndicator();
  const spiceIndicator = getSpiceIndicator();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        flexWrap: 'wrap'
      }}
    >
      {/* Vegetarian/Non-Vegetarian Indicator */}
      <Tooltip title={vegIndicator.tooltip} arrow>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size === 'small' ? 20 : 24,
            height: size === 'small' ? 20 : 24,
            border: `2px solid ${vegIndicator.icon.props.sx.color}`,
            borderRadius: '2px',
            backgroundColor: 'white'
          }}
        >
          {vegIndicator.icon}
        </Box>
      </Tooltip>

      {/* Vegan Indicator */}
      {showVeganIndicator && item.isVegan && (
        <Tooltip title="Vegan" arrow>
          <Chip
            icon={<VeganIcon />}
            label="Vegan"
            size={size}
            color="success"
            variant={variant}
            sx={{ 
              fontSize: size === 'small' ? '0.7rem' : '0.75rem',
              height: size === 'small' ? 20 : 24
            }}
          />
        </Tooltip>
      )}

      {/* Spice Level Indicator */}
      {showSpiceLevel && item.spiceLevel && (
        <Tooltip title={`Spice Level: ${spiceIndicator.label}`} arrow>
          <Chip
            icon={
              <SpiceIcon 
                sx={{ 
                  color: spiceIndicator.color,
                  fontSize: size === 'small' ? 14 : 16
                }} 
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span>{spiceIndicator.icon}</span>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: size === 'small' ? '0.65rem' : '0.7rem',
                    fontWeight: 500
                  }}
                >
                  {spiceIndicator.label}
                </Typography>
              </Box>
            }
            size={size}
            color={spiceIndicator.chipColor}
            variant={variant}
            sx={{ 
              height: size === 'small' ? 20 : 24,
              '& .MuiChip-label': {
                padding: size === 'small' ? '0 4px' : '0 6px'
              }
            }}
          />
        </Tooltip>
      )}

      {/* Additional Tags */}
      {item.tags && item.tags.includes('popular') && (
        <Chip
          label="Popular"
          size={size}
          color="primary"
          variant="filled"
          sx={{ 
            fontSize: size === 'small' ? '0.65rem' : '0.7rem',
            height: size === 'small' ? 20 : 24,
            backgroundColor: '#ff6b35',
            color: 'white',
            fontWeight: 500
          }}
        />
      )}

      {item.tags && item.tags.includes('signature') && (
        <Chip
          label="Signature"
          size={size}
          color="secondary"
          variant="filled"
          sx={{ 
            fontSize: size === 'small' ? '0.65rem' : '0.7rem',
            height: size === 'small' ? 20 : 24,
            backgroundColor: '#d32f2f',
            color: 'white',
            fontWeight: 500
          }}
        />
      )}

      {item.tags && item.tags.includes('new') && (
        <Chip
          label="New"
          size={size}
          color="info"
          variant="filled"
          sx={{ 
            fontSize: size === 'small' ? '0.65rem' : '0.7rem',
            height: size === 'small' ? 20 : 24,
            fontWeight: 500
          }}
        />
      )}
    </Box>
  );
};

/**
 * Compact version for menu cards
 */
export const CompactDietaryIndicators = ({ item }) => (
  <DietaryIndicators 
    item={item} 
    size="small" 
    variant="filled"
    showVeganIndicator={false}
  />
);

/**
 * Detailed version for item details
 */
export const DetailedDietaryIndicators = ({ item }) => (
  <DietaryIndicators 
    item={item} 
    size="medium" 
    variant="outlined"
    showSpiceLevel={true}
    showVeganIndicator={true}
  />
);

/**
 * Legend component to explain dietary indicators
 */
export const DietaryLegend = () => (
  <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 2, mb: 2 }}>
    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#5d4037' }}>
      Dietary Indicators Guide
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <VegIcon sx={{ color: '#2e7d32', fontSize: 16 }} />
        <Typography variant="caption">Vegetarian</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <NonVegIcon sx={{ color: '#c62828', fontSize: 16 }} />
        <Typography variant="caption">Non-Vegetarian</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <VeganIcon sx={{ color: '#2e7d32', fontSize: 16 }} />
        <Typography variant="caption">Vegan</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <SpiceIcon sx={{ color: '#2e7d32', fontSize: 16 }} />
        <Typography variant="caption">🌿 Mild</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <SpiceIcon sx={{ color: '#f57c00', fontSize: 16 }} />
        <Typography variant="caption">🌶️ Medium</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <SpiceIcon sx={{ color: '#d84315', fontSize: 16 }} />
        <Typography variant="caption">🔥 Hot</Typography>
      </Box>
    </Box>
  </Box>
);

export default DietaryIndicators;
