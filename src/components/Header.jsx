import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person'; // Иконка для профиля
import SettingsIcon from '@mui/icons-material/Settings'; // Иконка для настроек

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
}));

// Стиль для элемента меню
const MenuItem = styled('li')(({ theme }) => ({
	color: 'white',
	transition: 'color 0.3s',
	'&:hover': {
		color: theme.palette.secondary.main, // цвет при наведении
	},
}));

const Header = () => {
	return (
		<HeaderContainer position='static'>
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
				</MenuList>
			</Toolbar>
		</HeaderContainer>
	);
};

export default Header;
