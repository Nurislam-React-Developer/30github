import React from 'react';
import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material';

const VisualSettings = ({
  accentColor,
  setAccentColor,
  particlesEnabled,
  setParticlesEnabled,
  backgroundTheme,
  handleBackgroundThemeChange,
  backgroundThemes,
  handleBackgroundChange,
  saveSettings,
  resetSettings,
  particlesCount
}) => {
  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Визуальные настройки
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Цвет акцента</InputLabel>
        <Select
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          fullWidth
        >
          <MenuItem value='#2196f3'>Синий</MenuItem>
          <MenuItem value='#4caf50'>Зелёный</MenuItem>
          <MenuItem value='#ff9800'>Оранжевый</MenuItem>
          <MenuItem value='#e91e63'>Розовый</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={particlesEnabled}
            onChange={() => setParticlesEnabled((prev) => !prev)}
          />
        }
        label={
          particlesEnabled ? 'Анимация включена' : 'Анимация выключена'
        }
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Тема фона</InputLabel>
        <Select
          value={backgroundTheme}
          onChange={(e) => handleBackgroundThemeChange(e.target.value)}
          fullWidth
        >
          {backgroundThemes.map((theme) => (
            <MenuItem key={theme.value} value={theme.value}>
              {theme.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant='contained'
        component='label'
        fullWidth
        sx={{ mb: 1 }}
      >
        Загрузить свой фон
        <input
          type='file'
          hidden
          onChange={handleBackgroundChange}
          accept='image/*,video/*'
        />
      </Button>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={saveSettings}
          sx={{
            background: accentColor,
            '&:hover': {
              background: `${accentColor}cc`,
            },
            flex: 1,
          }}
        >
          Сохранить настройки
        </Button>

        <Button
          variant='outlined'
          color='error'
          onClick={resetSettings}
          sx={{ flex: 1 }}
        >
          Сбросить настройки
        </Button>
      </Box>
      
      <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
        Количество частиц: {particlesCount}
      </Typography>
    </Box>
  );
};

export default VisualSettings;