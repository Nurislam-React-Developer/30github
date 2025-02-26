import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/userSlice';

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const currentUser = useSelector(selectCurrentUser);
  const [postData, setPostData] = useState({
    description: '',
    image: null,
    imagePreview: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.description.trim() && !postData.image) {
      alert('Please add a description or image');
      return;
    }

    // Here we would typically send the data to a server
    // For now, we'll just add it to local storage
    const newPost = {
      id: Date.now(),
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      image: postData.imagePreview,
      description: postData.description,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
    };

    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    localStorage.setItem('posts', JSON.stringify([newPost, ...existingPosts]));

    // Navigate back to home page
    navigate('/');
  };

  return (
    <Container darkMode={darkMode}>
      <StyledPaper
        elevation={3}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        darkMode={darkMode}
      >
        <Typography variant="h4" gutterBottom align="center" color={darkMode ? '#fff' : '#000'}>
          Создать новый пост
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Что у вас нового?"
            value={postData.description}
            onChange={(e) => setPostData(prev => ({ ...prev, description: e.target.value }))}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? '#bb86fc' : '#3f51b5',
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? '#bb86fc' : '#3f51b5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: darkMode ? '#bb86fc' : '#3f51b5',
                },
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : '#000',
              },
            }}
          />

          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <IconButton
                component="span"
                sx={{
                  backgroundColor: darkMode ? '#bb86fc20' : '#3f51b520',
                  '&:hover': {
                    backgroundColor: darkMode ? '#bb86fc40' : '#3f51b540',
                  },
                }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: darkMode ? '#bb86fc' : '#3f51b5' }} />
              </IconButton>
            </label>
          </Box>

          {postData.imagePreview && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              sx={{ mb: 2, textAlign: 'center' }}
            >
              <img
                src={postData.imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                bgcolor: darkMode ? '#bb86fc' : '#3f51b5',
                '&:hover': {
                  bgcolor: darkMode ? '#9c27b0' : '#303f9f',
                },
              }}
            >
              Опубликовать
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{
                color: darkMode ? '#bb86fc' : '#3f51b5',
                borderColor: darkMode ? '#bb86fc' : '#3f51b5',
                '&:hover': {
                  borderColor: darkMode ? '#9c27b0' : '#303f9f',
                },
              }}
            >
              Отмена
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default CreatePost;

const Container = styled(Box)(({ darkMode }) => ({
  minHeight: '100vh',
  padding: '24px',
  backgroundColor: darkMode ? '#121212' : '#f5f5f5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}));

const StyledPaper = styled(Paper)(({ darkMode }) => ({
  padding: '24px',
  maxWidth: '600px',
  width: '100%',
  backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
  marginTop: '20px',
}));