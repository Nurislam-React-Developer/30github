import { CardContent, CardMedia, Divider, Typography } from '@mui/material';
import React from 'react';
import { getFallbackImage, handleImageError } from '../../../utils/imageUtils';

const PostContent = ({ post, darkMode }) => {
	return (
		<>
			<CardMedia
				component='img'
				image={post?.image || getFallbackImage('400x400', 'No+Image')}
				alt='Post image'
				height='400'
				onError={handleImageError}
				sx={{ objectFit: 'cover' }}
			/>
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
};

export default PostContent;
