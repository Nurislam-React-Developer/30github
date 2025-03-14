import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
	Avatar,
	Box,
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const CommentItem = ({
	comment,
	darkMode,
	onDeleteComment,
	postId,
	formatTimestamp,
	userName,
	handleLikeComment,
	isPostAuthor,
	likes,
}) => {
	const isLiked = likes.includes(userName);

	return (
		<ListItem
			alignitems='flex-start'
			component={motion.div}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			sx={{
				py: 1.5,
				display: 'flex',
				justifyContent: 'space-between',
				borderBottom: '1px solid',
				borderColor: darkMode
					? 'rgba(255, 255, 255, 0.1)'
					: 'rgba(0, 0, 0, 0.1)',
				'&:hover': {
					backgroundColor: darkMode
						? 'rgba(187, 134, 252, 0.08)'
						: 'rgba(63, 81, 181, 0.08)',
				},
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
				<ListItemAvatar>
					<Avatar src={comment.user.avatar} sx={{ width: 40, height: 40 }} />
				</ListItemAvatar>
				<ListItemText
					primary={
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Typography
								component='span'
								variant='subtitle2'
								color={darkMode ? '#ffffff' : 'text.primary'}
								sx={{ fontWeight: 600, mb: 0.5 }}
							>
								{comment.user.name}
							</Typography>
							<Typography
								component='span'
								variant='body2'
								color={darkMode ? '#ffffff' : 'text.primary'}
							>
								{comment.text}
							</Typography>
						</Box>
					}
					secondary={
						<Box sx={{ mt: 1 }}>
							<Typography
								component='span'
								variant='caption'
								color={darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
								sx={{ display: 'block' }}
							>
								{formatTimestamp(comment.timestamp)}
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Typography
									component='span'
									variant='caption'
									color={
										darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
									}
								>
									{likes.length > 0 &&
										`${likes.length} лайк${likes.length !== 1 ? 'ов' : ''}`}
								</Typography>
							</Box>
						</Box>
					}
					sx={{
						margin: 0,
					}}
				/>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 1,
				}}
			>
				<IconButton
					size='small'
					onClick={() => handleLikeComment(comment.id)}
					sx={{
						color: isLiked
							? '#ff1744'
							: darkMode
							? 'rgba(255, 255, 255, 0.5)'
							: 'rgba(0, 0, 0, 0.5)',
					}}
				>
					<FavoriteIcon fontSize='small' />
				</IconButton>
				{(comment.user.name === userName || isPostAuthor) && (
					<IconButton
						size='small'
						onClick={() => onDeleteComment(postId, comment.id)}
						sx={{
							color: darkMode
								? 'rgba(255, 255, 255, 0.5)'
								: 'rgba(0, 0, 0, 0.5)',
						}}
					>
						<DeleteIcon fontSize='small' />
					</IconButton>
				)}
			</Box>
		</ListItem>
	);
};

export default CommentItem;
