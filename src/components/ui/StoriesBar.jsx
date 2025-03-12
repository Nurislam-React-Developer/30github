import React from 'react';
import { useTheme } from '@mui/material/styles';
import StoriesBar from './stories/StoriesBar';

// This is a wrapper component that redirects to the modular implementation
const StoriesBarWrapper = ({ darkMode }) => {
  const theme = useTheme();
  
  // Pass the darkMode prop to the modular implementation
  return <StoriesBar darkMode={darkMode} />;
};

export default StoriesBarWrapper;