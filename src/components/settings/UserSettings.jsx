import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const UserSettings = ({ name, setName, email, setEmail, avatar, handleAvatarChange }) => {
  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Основные настройки
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Аватар
        </Typography>
        {avatar && (
          <Box
            component='img'
            src={avatar}
            alt='Avatar'
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              mb: 2,
              objectFit: 'cover',
              border: '2px solid #3f51b5'
            }}
          />
        )}
        <Button
          variant='contained'
          component='label'
          size='small'
        >
          {avatar ? 'Изменить аватар' : 'Загрузить аватар'}
          <input
            type='file'
            hidden
            onChange={handleAvatarChange}
            accept='image/*'
          />
        </Button>
      </Box>
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