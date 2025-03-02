import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';

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
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={post?.user?.avatar} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" component="div" sx={{ color: darkMode ? '#ffffff' : '#000000' }}>
              {post?.user?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="textSecondary" component="div" sx={{ color: darkMode ? '#bb86fc' : '#3f51b5' }}>
              {formatTimestamp(post?.timestamp)}
              {post?.edited && ' (изменено)'}
            </Typography>
          </Box>
        </Box>
        {(post?.user?.name === currentUser?.name) && (
          <IconButton onClick={(e) => onMenuOpen(e, post)}>
            <MoreVertIcon sx={{ color: darkMode ? '#ffffff' : '#000000' }} />
          </IconButton>
        )}
      </Box>
      <CardMedia
        component="img"
        image={post?.image || 'https://via.placeholder.com/400x400?text=No+Image'}
        alt="Post image"
        height="400"
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography
          variant="body1"
          component="div"
          gutterBottom
          sx={{ color: darkMode ? '#ffffff' : '#000000' }}
        >
          {post?.description || 'No description'}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            size="small"
            color={darkMode ? 'secondary' : 'primary'}
            variant="contained"
            onClick={() => onLike(post?.id)}
            sx={{
              color: post?.liked ? '#ff1744' : '#9e9e9e'
            }}
          >
            <FavoriteIcon />
            <Typography
              variant="caption"
              component="span"
              sx={{ ml: 1 }}
            >
              {post?.likes || 0}
            </Typography>
          </IconButton>
          <IconButton
            size="small"
            color={darkMode ? 'secondary' : 'primary'}
            onClick={() => onOpenComments(post)}
          >
            <CommentIcon />
            <Typography
              variant="caption"
              component="span"
              sx={{ ml: 1 }}
            >
              {post.comments?.length || 0}
            </Typography>
          </IconButton>
          <IconButton
            size="small"
            color={darkMode ? 'secondary' : 'primary'}
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;