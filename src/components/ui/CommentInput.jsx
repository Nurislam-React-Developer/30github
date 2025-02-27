import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';

const CommentInput = ({ value, onChange, onSubmit, darkMode }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-start',
      }}
    >
      <TextField
        multiline
        maxRows={4}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder="Написать комментарий..."
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            '& fieldset': {
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: darkMode ? '#bb86fc' : '#3f51b5',
            },
            '&.Mui-focused fieldset': {
              borderColor: darkMode ? '#bb86fc' : '#3f51b5',
            },
          },
          '& .MuiInputBase-input': {
            color: darkMode ? '#ffffff' : '#000000',
            '&::placeholder': {
              color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              opacity: 1,
            },
          },
        }}
      />
      <IconButton
        type="submit"
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!value.trim()}
        sx={{
          backgroundColor: darkMode ? '#bb86fc' : '#3f51b5',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: darkMode ? '#9c27b0' : '#303f9f',
          },
          '&.Mui-disabled': {
            backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(63, 81, 181, 0.3)',
            color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default CommentInput;