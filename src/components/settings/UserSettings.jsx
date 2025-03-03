import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const UserSettings = ({ name, setName, email, setEmail }) => {
  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Основные настройки
      </Typography>
      <TextField
        label='Имя'
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label='Электронная почта'
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default UserSettings;