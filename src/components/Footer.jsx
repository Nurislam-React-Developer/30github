import React from 'react';
import { Grid, Typography, Link, IconButton, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
	return (
		<footer
			style={{
				background: '#121212', // Темный фон
				color: '#fff',
				padding: '40px 20px',
				marginTop: 'auto', // Прижимает футер к низу страницы
			}}
		>
			{/* Основной контейнер */}
			<Grid container spacing={4} justifyContent='center'>
				{/* Блок о вас */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='h5'
						component='div'
						gutterBottom
						sx={{ fontWeight: 'bold' }}
					>
						Обо мне
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
					>
						Привет! Я разработчик, создающий современные веб-приложения. Этот
						проект — мой пет-проект, где я экспериментирую с новыми
						технологиями.
					</Typography>
				</Grid>

				{/* Блок ссылок */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
						Полезные ссылки
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
						}}
					>
						<Link
							href='#about'
							color='inherit'
							underline='hover'
							sx={{ transition: 'color 0.3s' }}
						>
							Обо мне
						</Link>
						<Link
							href='#projects'
							color='inherit'
							underline='hover'
							sx={{ transition: 'color 0.3s' }}
						>
							Проекты
						</Link>
						<Link
							href='#skills'
							color='inherit'
							underline='hover'
							sx={{ transition: 'color 0.3s' }}
						>
							Навыки
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

				{/* Блок контактов */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
						Контакты
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
					>
						Свяжитесь со мной, чтобы обсудить проект или просто поздороваться!
					</Typography>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
							mt: 2,
						}}
					>
						<IconButton
							aria-label='Email'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<EmailIcon sx={{ color: '#fff' }} />
						</IconButton>
						<Link
							href='mailto:your-email@example.com'
							color='inherit'
							underline='hover'
						>
							your-email@example.com
						</Link>
					</Box>
				</Grid>

				{/* Социальные сети */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold' }}>
						Соцсети
					</Typography>
					<Box
						sx={{
							display: 'flex',
							gap: '10px',
						}}
					>
						<IconButton
							aria-label='GitHub'
							href='https://github.com/yourusername'
							target='_blank'
							rel='noopener noreferrer'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<GitHubIcon sx={{ color: '#fff' }} />
						</IconButton>
						<IconButton
							aria-label='LinkedIn'
							href='https://www.linkedin.com/in/yourusername'
							target='_blank'
							rel='noopener noreferrer'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<LinkedInIcon sx={{ color: '#fff' }} />
						</IconButton>
						<IconButton
							aria-label='Twitter'
							href='https://twitter.com/yourusername'
							target='_blank'
							rel='noopener noreferrer'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
							}}
						>
							<TwitterIcon sx={{ color: '#fff' }} />
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
				© {new Date().getFullYear()} Your Name. Все права защищены.
			</Typography>
		</footer>
	);
};

export default Footer;
