import { Box, Card } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { PostActions, PostContent, PostHeader } from './post';

const PostCard = ({
	post,
	darkMode,
	currentUser,
	onLike,
	onOpenComments,
	onMenuOpen,
	formatTimestamp,
}) => {
	return (
		<Card
			component={motion.div}
			whileHover={{ y: -2 }}
			sx={{
				mb: 3,
				backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
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
};

export default PostCard;
