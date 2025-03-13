import AddBoxIcon from '@mui/icons-material/AddBox';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { Switch } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const Header = () => {
	const { darkMode, toggleTheme } = useTheme();
	const [notificationCount, setNotificationCount] = useState(0);

	useEffect(() => {
		const updateNotificationCount = () => {
			const updatedNotifications = JSON.parse(
				localStorage.getItem('notifications') || '[]'
			);
			setNotificationCount(updatedNotifications.length);
		};

		updateNotificationCount();

		window.addEventListener('storage', updateNotificationCount);

		const handleCustomEvent = () => {
			updateNotificationCount();
		};
		window.addEventListener('notificationsUpdated', handleCustomEvent);

		return () => {
			window.removeEventListener('storage', updateNotificationCount);
			window.removeEventListener('notificationsUpdated', handleCustomEvent);
		};
	}, []);

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
							<Badge
								badgeContent={notificationCount}
								color='error'
								invisible={notificationCount === 0}
							>
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
							icon={<Brightness7Icon />}
							checkedIcon={<Brightness4Icon />}
						/>
					</MenuItem>
				</MenuList>
			</Toolbar>
		</HeaderContainer>
	);
};

export default Header;

const HeaderContainer = styled(AppBar)(({ theme }) => ({
	backgroundColor: '#3f51b5',
	boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
}));

const MenuList = styled('ul')(({ theme }) => ({
	listStyle: 'none',
	display: 'flex',
	margin: 0,
	padding: 0,
	gap: '20px',
	alignItems: 'center',
}));

const MenuItem = styled('li')(({ theme }) => ({
	color: 'white',
	transition: 'color 0.3s',
	'&:hover': {
		color: theme.palette.secondary.main,
	},
}));
