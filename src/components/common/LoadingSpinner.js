import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ fullScreen = false }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: fullScreen ? '100vh' : '100%',
  minHeight: fullScreen ? '100vh' : '200px',
  backgroundColor: fullScreen ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
  position: fullScreen ? 'fixed' : 'relative',
  top: 0,
  left: 0,
  zIndex: fullScreen ? 9999 : 'auto',
}));

const LoadingSpinner = ({ size = 40, fullScreen = false }) => {
  return (
    <StyledBox fullScreen={fullScreen}>
      <CircularProgress size={size} color="primary" />
    </StyledBox>
  );
};

export default LoadingSpinner;
