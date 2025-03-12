import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import React from 'react';

const VisualSettings = ({
	accentColor,
	setAccentColor,
	backgroundTheme,
	handleBackgroundThemeChange,
	backgroundThemes,
	handleBackgroundChange,
	saveSettings,
	resetSettings,
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

			<Button variant='contained' component='label' fullWidth sx={{ mb: 1 }}>
				Загрузить свой фон
				<input
					type='file'
					hidden
					onChange={handleBackgroundChange}
					accept='image/*,video/*'
				/>
			</Button>
		</Box>
	);
};

export default VisualSettings;
