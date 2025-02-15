import React from 'react';
import { Grid, Typography, Link, IconButton, Box } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
	return (
		<footer
			style={{
				background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
				color: '#fff',
				padding: '40px 20px',
				marginTop: 'auto', // Прижимает футер к низу страницы
			}}
		>
			{/* Основной контейнер */}
			<Grid container spacing={4} justifyContent='center'>
				{/* Логотип или название компании */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='h5'
						component='div'
						gutterBottom
						sx={{ fontWeight: 'bold' }}
					>
						MyBrand
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
					>
						Современные решения для вашего бизнеса.
					</Typography>
				</Grid>

				{/* Блок навигации */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
						Навигация
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
						}}
					>
						<Link
							href='#home'
							color='inherit'
							underline='hover'
							sx={{ transition: 'color 0.3s' }}
						>
							Главная
						</Link>
						<Link
							href='#about'
							color='inherit'
							underline='hover'
							sx={{ transition: 'color 0.3s' }}
						>
							О нас
						</Link>
						<Link
							href='#services'
							color='inherit'
							underline='hover'
							sx={{ transition: 'color 0.3s' }}
						>
							Услуги
						</Link>
						<Link
							href='#contact'
							color='inherit'
							underline='hover'
							sx={{ transition: 'color 0.3s' }}
						>
							Контакты
						</Link>
					</Box>
				</Grid>

				{/* Контактная информация */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
						Контакты
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
					>
						Адрес: г. Москва, ул. Примерная, д. 1
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
					>
						Телефон: +7 (999) 123-45-67
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
					>
						Email: info@mybrand.com
					</Typography>
				</Grid>

				{/* Социальные сети */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
						Мы в соцсетях
					</Typography>
					<Box
						sx={{
							display: 'flex',
							gap: '10px',
						}}
					>
						<IconButton
							aria-label='Facebook'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<FacebookIcon sx={{ color: '#fff' }} />
						</IconButton>
						<IconButton
							aria-label='Twitter'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<TwitterIcon sx={{ color: '#fff' }} />
						</IconButton>
						<IconButton
							aria-label='Instagram'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<InstagramIcon sx={{ color: '#fff' }} />
						</IconButton>
						<IconButton
							aria-label='LinkedIn'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<LinkedInIcon sx={{ color: '#fff' }} />
						</IconButton>
					</Box>
				</Grid>
			</Grid>

			{/* Нижняя часть футера */}
			<Typography
				variant='body2'
				align='center'
				mt={4}
				sx={{
					color: 'rgba(255, 255, 255, 0.7)',
					fontSize: '0.875rem',
				}}
			>
				© {new Date().getFullYear()} MyBrand. Все права защищены.
			</Typography>
		</footer>
	);
};

export default Footer;
