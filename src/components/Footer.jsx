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
				background: '#1e1e1e', // Темно-серый фон
				color: '#fff',
				padding: '20px', // Уменьшаем отступы
				marginTop: 'auto', // Прижимает футер к низу страницы
			}}
		>
			{/* Основной контейнер */}
			<Grid container spacing={2} justifyContent='center'>
				{/* Блок о вас */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='subtitle1'
						gutterBottom
						sx={{ fontWeight: 'bold' }}
					>
						Обо мне
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}
					>
						Привет! Я разработчик, создающий современные веб-приложения. Этот
						проект — мой пет-проект.
					</Typography>
				</Grid>

				{/* Блок ссылок */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='subtitle1'
						gutterBottom
						sx={{ fontWeight: 'bold' }}
					>
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
							sx={{ fontSize: '0.875rem', transition: 'color 0.3s' }}
						>
							Обо мне
						</Link>
						<Link
							href='#projects'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.875rem', transition: 'color 0.3s' }}
						>
							Проекты
						</Link>
						<Link
							href='#skills'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.875rem', transition: 'color 0.3s' }}
						>
							Навыки
						</Link>
						<Link
							href='#contact'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.875rem', transition: 'color 0.3s' }}
						>
							Контакты
						</Link>
					</Box>
				</Grid>

				{/* Блок контактов */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='subtitle1'
						gutterBottom
						sx={{ fontWeight: 'bold' }}
					>
						Контакты
					</Typography>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
							mt: 1,
						}}
					>
						<IconButton
							aria-label='Email'
							href='mailto:your-email@example.com'
							target='_blank'
							rel='noopener noreferrer'
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
								padding: '6px', // Уменьшаем размер кнопки
							}}
						>
							<EmailIcon sx={{ color: '#fff', fontSize: '1.25rem' }} />
						</IconButton>
						<Link
							href='mailto:your-email@example.com'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.875rem' }}
						>
							your-email@example.com
						</Link>
					</Box>
				</Grid>

				{/* Социальные сети */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='subtitle1'
						gutterBottom
						sx={{ fontWeight: 'bold' }}
					>
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
								padding: '6px', // Уменьшаем размер кнопки
							}}
						>
							<GitHubIcon sx={{ color: '#fff', fontSize: '1.25rem' }} />
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
								padding: '6px', // Уменьшаем размер кнопки
							}}
						>
							<LinkedInIcon sx={{ color: '#fff', fontSize: '1.25rem' }} />
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
								padding: '6px', // Уменьшаем размер кнопки
							}}
						>
							<TwitterIcon sx={{ color: '#fff', fontSize: '1.25rem' }} />
						</IconButton>
					</Box>
				</Grid>
			</Grid>

			{/* Нижняя часть футера */}
			<Typography
				variant='caption'
				align='center'
				mt={2}
				sx={{
					color: 'rgba(255, 255, 255, 0.7)',
					fontSize: '0.75rem',
					display: 'block',
				}}
			>
				© {new Date().getFullYear()} Your Name. Все права защищены.
			</Typography>
		</footer>
	);
};

export default Footer;
