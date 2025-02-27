import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import CommentList from './CommentList';
import CommentInput from './CommentInput';

const CommentModal = ({
  open,
  onClose,
  darkMode,
  selectedPost,
  commentText,
  onCommentChange,
  onAddComment,
  onDeleteComment,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
          height: '90vh',
          margin: '20px',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="close"
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1300,
          backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(63, 81, 181, 0.1)',
          color: darkMode ? '#bb86fc' : '#3f51b5',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.2)' : 'rgba(63, 81, 181, 0.2)',
            color: darkMode ? '#9c27b0' : '#303f9f',
          }
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          pr: 6
        }}
      >
        Комментарии
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ 
          pt: 0, 
          height: 'calc(90vh - 180px)', 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: darkMode ? '#121212' : '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            background: darkMode ? '#bb86fc' : '#3f51b5',
            borderRadius: '4px'
          }
        }}>
          <CommentList
            comments={selectedPost?.comments || []}
            darkMode={darkMode}
            onDeleteComment={onDeleteComment}
            postId={selectedPost?.id}
          />
        </List>
        <Box sx={{ 
          p: 2, 
          position: 'sticky', 
          bottom: 0, 
          bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff'
        }}>
          <CommentInput
            value={commentText}
            onChange={onCommentChange}
            onSubmit={onAddComment}
            darkMode={darkMode}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;