import {
	Box,
	Card,
	useMediaQuery,
	useTheme as useMuiTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { memo } from 'react';
import { PostActions, PostContent, PostHeader } from './post';

const PostCard = memo(
	({
		post,
		darkMode,
		currentUser,
		onLike,
		onOpenComments,
		onMenuOpen,
		formatTimestamp,
	}) => {
		// Use Material-UI's responsive hooks
		const muiTheme = useMuiTheme();
		const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

		return (
			<Card
				component={motion.div}
				// Disable hover animation on mobile for better performance
				whileHover={isMobile ? undefined : { y: -2 }}
				sx={{
					mb: 3,
					backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
					// Add responsive styles for mobile
					width: '100%',
					maxWidth: '100%',
					boxShadow: isMobile ? '0 1px 3px rgba(0,0,0,0.12)' : undefined,
				}}
			>
				<PostHeader
					post={post}
					darkMode={darkMode}
					currentUser={currentUser}
					onMenuOpen={onMenuOpen}
					formatTimestamp={formatTimestamp}
				/>
				<PostContent post={post} darkMode={darkMode} />
				<Box sx={{ px: 2, pb: 2 }}>
					<PostActions
						post={post}
						darkMode={darkMode}
						onLike={onLike}
						onOpenComments={onOpenComments}
					/>
				</Box>
			</Card>
		);
	}
);

export default PostCard;
