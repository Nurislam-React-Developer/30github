import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'react-toastify';

const CommentList = ({ comments, darkMode, onDeleteComment, postId }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userName = currentUser?.name || localStorage.getItem('profileName');
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const currentPost = posts.find(post => post.id === postId);
  const isPostAuthor = currentPost?.author?.name === userName;
  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'Invalid date';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'dd MMMM в HH:mm', { locale: ru });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  const handleLikeComment = (commentId) => {
    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const userName = currentUser?.name || localStorage.getItem('profileName');

      // Get all posts
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              const likes = comment.likes || [];
              const userLiked = likes.includes(userName);
              
              if (userLiked) {
                // Unlike
                return {
                  ...comment,
                  likes: likes.filter(name => name !== userName)
                };
              } else {
                // Only create notification if the post author likes the comment
                if (isPostAuthor) {
                  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                  notifications.unshift({
                    id: Date.now(),
                    type: 'comment_like',
                    user: userName,
                    postId: postId,
                    commentId: commentId,
                    timestamp: new Date().toISOString()
                  });
                  localStorage.setItem('notifications', JSON.stringify(notifications));
                  
                  // Show notification toast to comment owner
                  if (comment.user.name !== userName) {
                    toast.info(`${userName} лайкнул ваш комментарий`, {
                      position: 'top-right',
                      autoClose: 3000
                    });
                  }
                }
                
                return {
                  ...comment,
                  likes: [...likes, userName]
                };
              }
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      });


      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      window.dispatchEvent(new Event('storage')); // Trigger update
    } catch (error) {
      console.error('Error handling comment like:', error);
      toast.error('Ошибка при обработке лайка');
    }
  };

  return (
    <>
      {comments.map((comment, index) => {
        const likes = comment.likes || [];
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const userName = currentUser?.name || localStorage.getItem('profileName');
        const isLiked = likes.includes(userName);

        return (
          <ListItem 
            key={comment.id} 
            alignitems="flex-start"
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.08)' : 'rgba(63, 81, 181, 0.08)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <ListItemAvatar>
                <Avatar 
                  src={comment.user.avatar}
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      component="span"
                      variant="subtitle2"
                      color={darkMode ? '#ffffff' : 'text.primary'}
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      {comment.user.name}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color={darkMode ? '#ffffff' : 'text.primary'}
                    >
                      {comment.text}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      component="span"
                      variant="caption"
                      color={darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
                      sx={{ display: 'block' }}
                    >
                      {formatTimestamp(comment.timestamp)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        component="span"
                        variant="caption"
                        color={darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
                      >
                        {likes.length > 0 && `${likes.length} лайк${likes.length !== 1 ? 'ов' : ''}`}
                      </Typography>
                      {likes.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {likes.slice(0, 3).map((likedBy, idx) => (
                            <Avatar
                              key={idx}
                              src={posts.find(p => p.author?.name === likedBy)?.author?.avatar}
                              sx={{ width: 16, height: 16 }}
                            />
                          ))}
                          {likes.length > 3 && (
                            <Typography
                              variant="caption"
                              color={darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
                            >
                              +{likes.length - 3}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                }
                sx={{
                  margin: 0
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleLikeComment(comment.id)}
                sx={{
                  color: isLiked ? '#ff1744' : (darkMode ? '#ffffff' : '#000000')
                }}
              >
                <FavoriteIcon fontSize="small" />
              </IconButton>
              {isPostAuthor && (
                <IconButton
                  size="small"
                  onClick={() => onDeleteComment(postId, comment.id)}
                  color="error"
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </ListItem>
        );
      })}
    </>
  );
};

export default CommentList;