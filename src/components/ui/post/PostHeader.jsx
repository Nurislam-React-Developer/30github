import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import React from 'react';

const PostHeader = ({
	post,
	darkMode,
	currentUser,
	onMenuOpen,
	formatTimestamp,
}) => {
	return (
		<Box
			sx={{
				p: 2,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Avatar src={post?.user?.avatar} />
				<Box sx={{ ml: 2 }}>
					<Typography
						variant='subtitle1'
						component='div'
						sx={{ color: darkMode ? '#ffffff' : '#000000' }}
					>
						{post?.user?.name || 'Anonymous'}
					</Typography>
					<Typography
						variant='caption'
						color='textSecondary'
						component='div'
						sx={{ color: darkMode ? '#bb86fc' : '#3f51b5' }}
					>
						{formatTimestamp(post?.timestamp)}
						{post?.edited && ' (изменено)'}
					</Typography>
				</Box>
			</Box>
			{post?.user?.name === currentUser?.name && (
				<IconButton onClick={(e) => onMenuOpen(e, post)}>
					<MoreVertIcon sx={{ color: darkMode ? '#ffffff' : '#000000' }} />
				</IconButton>
			)}
		</Box>
	);
};

export default PostHeader;
