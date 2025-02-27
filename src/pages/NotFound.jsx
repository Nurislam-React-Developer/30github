import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Container darkMode={darkMode}>
      <ContentWrapper
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorCode
          as={motion.h1}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          darkMode={darkMode}
        >
          404
        </ErrorCode>

        <ErrorMessage
          variant="h5"
          component={motion.h2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          darkMode={darkMode}
        >
          Упс! Страница не найдена
        </ErrorMessage>

        <Description
          variant="body1"
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          darkMode={darkMode}
        >
          Похоже, страница, которую вы ищете, не существует или была перемещена.
          <br />
          Перенаправление на главную через {countdown} секунд...
        </Description>

        <HomeButton
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => navigate('/')}
          darkMode={darkMode}
        >
          Вернуться на главную
        </HomeButton>

        <IllustrationContainer
          as={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.3
          }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              stroke={darkMode ? "#bb86fc" : "#3f51b5"}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M65 80C65 80 85 100 100 100C115 100 135 80 135 80"
              stroke={darkMode ? "#bb86fc" : "#3f51b5"}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
            <motion.circle
              cx="75"
              cy="60"
              r="5"
              fill={darkMode ? "#bb86fc" : "#3f51b5"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
            />
            <motion.circle
              cx="125"
              cy="60"
              r="5"
              fill={darkMode ? "#bb86fc" : "#3f51b5"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
            />
          </svg>
        </IllustrationContainer>
      </ContentWrapper>
    </Container>
  );
};

export default NotFound;

const Container = styled(Box)(({ darkMode }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: darkMode ? '#121212' : '#f5f5f5',
  padding: '20px',
}));

const ContentWrapper = styled(Box)({
  textAlign: 'center',
  maxWidth: '600px',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
});

const ErrorCode = styled(Typography)(({ darkMode }) => ({
  fontSize: '120px',
  fontWeight: 'bold',
  marginBottom: '20px',
  background: darkMode
    ? 'linear-gradient(45deg, #bb86fc, #9c27b0)'
    : 'linear-gradient(45deg, #3f51b5, #2196f3)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: darkMode
    ? '2px 2px 4px rgba(187, 134, 252, 0.3)'
    : '2px 2px 4px rgba(63, 81, 181, 0.3)',
}));

const ErrorMessage = styled(Typography)(({ darkMode }) => ({
  color: darkMode ? '#bb86fc' : '#3f51b5',
  marginBottom: '16px',
  fontWeight: 500,
}));

const Description = styled(Typography)(({ darkMode }) => ({
  color: darkMode ? '#ffffff80' : '#00000080',
  marginBottom: '32px',
}));

const HomeButton = styled(Button)(({ darkMode }) => ({
  background: darkMode
    ? 'linear-gradient(45deg, #bb86fc, #9c27b0)'
    : 'linear-gradient(45deg, #3f51b5, #2196f3)',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '30px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  boxShadow: darkMode
    ? '0 4px 15px rgba(187, 134, 252, 0.3)'
    : '0 4px 15px rgba(63, 81, 181, 0.3)',
  '&:hover': {
    background: darkMode
      ? 'linear-gradient(45deg, #9c27b0, #bb86fc)'
      : 'linear-gradient(45deg, #2196f3, #3f51b5)',
  },
}));

const IllustrationContainer = styled(Box)({
  marginTop: '40px',
});