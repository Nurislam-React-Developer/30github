import React from 'react';
import { Box, Button, CircularProgress, Divider, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '../../theme/ThemeContext';

const AccountSettings = ({ isLoading, handleLogout }) => {
  const { darkMode } = useTheme();
  
  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Аккаунт
      </Typography>
      <Button
        variant="contained"
        color="error"
        fullWidth
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ mt: 1 }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: '#fff' }} />
        ) : (
          'Выйти из аккаунта'
        )}
      </Button>
    </Box>
  );
};

export default AccountSettings;