import {
	Box,
	CardContent,
	CardMedia,
	Divider,
	Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getFallbackImage, handleImageError } from '../../../utils/imageUtils';

const PostContent = React.memo(({ post, darkMode }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const imgRef = useRef(null);

	// Set up intersection observer for lazy loading
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 } // Trigger when 10% of the element is visible
		);

		if (imgRef.current) {
			observer.observe(imgRef.current);
		}

		return () => {
			if (imgRef.current) {
				observer.disconnect();
			}
		};
	}, []);

	const handleImageLoad = () => {
		setIsLoaded(true);
	};

	return (
		<>
			<Box ref={imgRef} sx={{ position: 'relative', height: 400 }}>
				{(isVisible || isLoaded) && (
					<CardMedia
						component='img'
						image={post?.image || getFallbackImage('400x400', 'No+Image')}
						alt='Post image'
						height='400'
						onError={handleImageError}
						onLoad={handleImageLoad}
						sx={{
							objectFit: 'cover',
							opacity: isLoaded ? 1 : 0,
							transition: 'opacity 0.3s',
						}}
					/>
				)}
				{!isLoaded && (
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: darkMode ? '#333' : '#f5f5f5',
						}}
					>
						<Typography variant='body2' color='textSecondary'>
							Загрузка изображения...
						</Typography>
					</Box>
				)}
			</Box>
			<CardContent>
				<Typography
					variant='body1'
					component='div'
					gutterBottom
					sx={{ color: darkMode ? '#ffffff' : '#000000' }}
				>
					{post?.description || 'No description'}
				</Typography>
				<Divider sx={{ my: 1 }} />
			</CardContent>
		</>
	);
});

export default PostContent;
