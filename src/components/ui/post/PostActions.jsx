import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';

const PostActions = ({ post, onLike, onOpenComments, darkMode }) => {
	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
			<IconButton
				size='small'
				color={darkMode ? 'secondary' : 'primary'}
				variant='contained'
				onClick={() => onLike(post?.id)}
				sx={{
					color: post?.liked ? '#ff1744' : '#9e9e9e',
				}}
			>
				<FavoriteIcon />
				<Typography variant='caption' component='span' sx={{ ml: 1 }}>
					{post?.likes || 0}
				</Typography>
			</IconButton>
			<IconButton
				size='small'
				color={darkMode ? 'secondary' : 'primary'}
				onClick={() => onOpenComments(post)}
			>
				<CommentIcon />
				<Typography variant='caption' component='span' sx={{ ml: 1 }}>
					{post?.comments?.length || 0}
				</Typography>
			</IconButton>
			<IconButton size='small' color={darkMode ? 'secondary' : 'primary'}>
				<ShareIcon />
			</IconButton>
		</Box>
	);
};

export default PostActions;
