import { styled } from '@mui/material/styles';
import { Avatar, Box } from '@mui/material';

// Стилизованный Avatar с градиентной рамкой для непросмотренных историй в стиле Instagram
export const StoryAvatar = styled(Avatar)(({ theme, viewed, darkMode }) => ({
  width: 62,
  height: 62,
  border: viewed 
    ? `2px solid ${darkMode ? '#333' : '#e0e0e0'}` 
    : '2px solid transparent',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  position: 'relative',
  zIndex: 1,
  '&::before': viewed ? {} : {
    content: '""',
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    zIndex: -1,
    animation: 'rotate 1.5s linear infinite',
  },
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

// Контейнер для аватарки и имени пользователя в стиле Instagram
export const StoryItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 4px',
  maxWidth: 64,
  padding: '0 2px',
}));