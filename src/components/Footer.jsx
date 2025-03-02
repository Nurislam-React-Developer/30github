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
				background: '#1e1e1e',
				color: '#fff',
				padding: '10px', // Reduced padding from 20px to 10px
				position: 'relative',
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				width: '100%'
			}}
		>
			{/* Основной контейнер */}
			<Grid container spacing={1} justifyContent='center'> {/* Reduced spacing from 2 to 1 */}
				{/* Блок о вас */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='body2' // Changed from subtitle1 to body2
						gutterBottom
						sx={{ fontWeight: 'bold', fontSize: '0.8rem' }} // Added smaller font size
					>
						Обо мне
					</Typography>
					<Typography
						variant='caption' // Changed from body2 to caption
						sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }} // Reduced font size
					>
						Привет! Я разработчик, создающий современные веб-приложения. Этот
						проект — мой пет-проект.
					</Typography>
				</Grid>

				{/* Блок ссылок */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='body2' // Changed from subtitle1 to body2
						gutterBottom
						sx={{ fontWeight: 'bold', fontSize: '0.8rem' }} // Added smaller font size
					>
						Полезные ссылки
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '4px', // Reduced gap from 8px to 4px
						}}
					>
						<Link
							href='#about'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.75rem', transition: 'color 0.3s' }} // Reduced font size
						>
							Обо мне
						</Link>
						<Link
							href='#projects'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.75rem', transition: 'color 0.3s' }} // Reduced font size
						>
							Проекты
						</Link>
						<Link
							href='#skills'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.75rem', transition: 'color 0.3s' }} // Reduced font size
						>
							Навыки
						</Link>
						<Link
							href='#contact'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.75rem', transition: 'color 0.3s' }} // Reduced font size
						>
							Контакты
						</Link>
					</Box>
				</Grid>

				{/* Блок контактов */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='body2' // Changed from subtitle1 to body2
						gutterBottom
						sx={{ fontWeight: 'bold', fontSize: '0.8rem' }} // Added smaller font size
					>
						Контакты
					</Typography>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '5px', // Reduced gap from 10px to 5px
							mt: 0.5, // Reduced margin top from 1 to 0.5
						}}
					>
						<IconButton
							aria-label='Email'
							href='mailto:your-email@example.com'
							target='_blank'
							rel='noopener noreferrer'
							size='small' // Added size small
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
								padding: '4px', // Reduced padding from 6px to 4px
							}}
						>
							<EmailIcon sx={{ color: '#fff', fontSize: '1rem' }} /> {/* Reduced icon size */}
						</IconButton>
						<Link
							href='mailto:your-email@example.com'
							color='inherit'
							underline='hover'
							sx={{ fontSize: '0.75rem' }} // Reduced font size
						>
							your-email@example.com
						</Link>
					</Box>
				</Grid>

				{/* Социальные сети */}
				<Grid item xs={12} sm={6} md={3}>
					<Typography
						variant='body2' // Changed from subtitle1 to body2
						gutterBottom
						sx={{ fontWeight: 'bold', fontSize: '0.8rem' }} // Added smaller font size
					>
						Соцсети
					</Typography>
					<Box
						sx={{
							display: 'flex',
							gap: '5px', // Reduced gap from 10px to 5px
						}}
					>
						<IconButton
							aria-label='GitHub'
							href='https://github.com/yourusername'
							target='_blank'
							rel='noopener noreferrer'
							size='small' // Added size small
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
								padding: '4px', // Reduced padding from 6px to 4px
							}}
						>
							<GitHubIcon sx={{ color: '#fff', fontSize: '1rem' }} /> {/* Reduced icon size */}
						</IconButton>
						<IconButton
							aria-label='LinkedIn'
							href='https://www.linkedin.com/in/yourusername'
							target='_blank'
							rel='noopener noreferrer'
							size='small' // Added size small
							sx={{
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
								transition: 'background-color 0.3s',
								padding: '4px', // Reduced padding from 6px to 4px
							}}
						>
							<LinkedInIcon sx={{ color: '#fff', fontSize: '1rem' }} /> {/* Reduced icon size */}
						</IconButton>
						<IconButton
							aria-label='Twitter'
							href='https://twitter.com/yourusername'
							target='_blank'
							rel='noopener noreferrer'
							size='small' // Added size small
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
				© {new Date().getFullYear()} Nurislam. Все права защищены.
			</Typography>
		</footer>
	);
};

export default Footer;
