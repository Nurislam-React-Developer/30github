import Brightness4Icon from '@mui/icons-material/Brightness4'; // Иконка для темной темы
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Иконка для светлой темы
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person'; // Иконка для профиля
import SettingsIcon from '@mui/icons-material/Settings'; // Иконка для настроек
import { Switch } from '@mui/material'; // Импортируем Switch
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import AddBoxIcon from '@mui/icons-material/AddBox';



const Header = () => {
	const { darkMode, toggleTheme } = useTheme(); // Используем контекст темы

	return (
		<HeaderContainer
			position='static'
			style={{ backgroundColor: darkMode ? '#000' : '#3f51b5' }}
		>
			<Toolbar>
				<Link to='/' style={{ textDecoration: 'none', flexGrow: 1 }}>
					<Typography variant='h6' component='div' color='white'>
						SocialNet
					</Typography>
				</Link>

				<MenuList>
					<MenuItem>
						<Link
							to='/'
							style={{
								color: 'white',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<HomeIcon sx={{ marginRight: '5px' }} /> Главная
						</Link>
					</MenuItem>
					<MenuItem>
						<Link
							to='/friends'
							style={{
								color: 'white',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<PeopleIcon sx={{ marginRight: '5px' }} /> Друзья
						</Link>
					</MenuItem>
					<MenuItem>
						<Link
							to='/notifications'
							style={{
								color: 'white',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<Badge badgeContent={3} color='error'>
								<NotificationsIcon sx={{ color: 'white' }} />
							</Badge>{' '}
							Уведомления
						</Link>
					</MenuItem>
					<MenuItem>
						<Link
							to='/create-post'
							style={{
								color: 'white',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<AddBoxIcon sx={{ marginRight: '5px' }} /> Создать пост
						</Link>
					</MenuItem>
					<MenuItem>
						<Link
							to='/profile'
							style={{
								color: 'white',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<PersonIcon sx={{ marginRight: '5px' }} /> Профиль
						</Link>
					</MenuItem>
					<MenuItem>
						<Link
							to='/settings'
							style={{
								color: 'white',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<SettingsIcon sx={{ marginRight: '5px' }} /> Настройки
						</Link>
					</MenuItem>
					<MenuItem>
						<Switch
							checked={darkMode}
							onChange={toggleTheme}
							color='default'
							inputProps={{ 'aria-label': 'toggle theme' }}
							icon={<Brightness7Icon />} // Иконка для светлой темы
							checkedIcon={<Brightness4Icon />} // Иконка для темной темы
						/>
					</MenuItem>
				</MenuList>
			</Toolbar>
		</HeaderContainer>
	);
};

export default Header;

// Стиль для контейнера заголовка
const HeaderContainer = styled(AppBar)(({ theme }) => ({
	backgroundColor: '#3f51b5', // Цвет фона заголовка
	boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
}));

// Стиль для меню
const MenuList = styled('ul')(({ theme }) => ({
	listStyle: 'none',
	display: 'flex',
	margin: 0,
	padding: 0,
	gap: '20px', // расстояние между элементами меню
	alignItems: 'center', // Выравнивание по центру
}));

// Стиль для элемента меню
const MenuItem = styled('li')(({ theme }) => ({
	color: 'white',
	transition: 'color 0.3s',
	'&:hover': {
		color: theme.palette.secondary.main, // цвет при наведении
	},
}));