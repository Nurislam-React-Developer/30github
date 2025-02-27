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
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const CommentList = ({ comments, darkMode, onDeleteComment, postId }) => {
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

  return (
    <>
      {comments.map((comment) => (
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
                <Typography
                  component="span"
                  variant="caption"
                  color={darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
                  sx={{ mt: 1, display: 'block' }}
                >
                  {formatTimestamp(comment.timestamp)}
                </Typography>
              }
              sx={{
                margin: 0
              }}
            />
          </Box>
          <IconButton
            size="small"
            onClick={() => onDeleteComment(postId, comment.id)}
            color="error"
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            sx={{ ml: 1 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      ))}
    </>
  );
};

export default CommentList;