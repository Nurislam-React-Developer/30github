import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { useTheme } from '../theme/ThemeContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import styled from '@emotion/styled';

const SignIn = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { showLoader, hideLoader } = useLoading();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://ce5a84bb27e301c4.mokky.dev/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message === 'Authentication failed' ? 'Неверный email или пароль' : 'Ошибка аутентификации');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Show success toast notification
      toast.success('Вы успешно вошли в аккаунт!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: darkMode ? 'dark' : 'light'
      });
      
      showLoader();
      navigate('/');
      setTimeout(hideLoader, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
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
        <IconWrapper
          as={motion.div}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          darkMode={darkMode}
        >
          <LockOutlinedIcon />
        </IconWrapper>

        <Typography
          variant="h4"
          component={motion.h1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          gutterBottom
          sx={{ color: darkMode ? '#fff' : '#000', mb: 3 }}
        >
          Sign In
        </Typography>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            {...register('email', { 
              required: 'Email обязателен для заполнения',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email'
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            sx={{
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
              '& .MuiInputLabel-root': {
                color: darkMode ? '#fff' : '#000',
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : '#000',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', { 
              required: 'Пароль обязателен для заполнения',
              minLength: {
                value: 6,
                message: 'Пароль должен содержать минимум 6 символов'
              }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: darkMode ? '#bb86fc' : '#3f51b5' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
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
              '& .MuiInputLabel-root': {
                color: darkMode ? '#fff' : '#000',
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : '#000',
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: darkMode ? '#bb86fc' : '#3f51b5',
              '&:hover': {
                bgcolor: darkMode ? '#9c27b0' : '#303f9f',
              },
              height: '48px'
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Sign In'
            )}
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: darkMode ? '#fff' : '#000' }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: darkMode ? '#bb86fc' : '#3f51b5',
                textDecoration: 'none'
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default SignIn;

const Container = styled(Box)(({ darkMode }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: darkMode ? '#121212' : '#f5f5f5',
  padding: '20px',
}));

const StyledPaper = styled(Paper)(({ darkMode }) => ({
  padding: '32px',
  maxWidth: '400px',
  width: '100%',
  backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const IconWrapper = styled(Box)(({ darkMode }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: darkMode ? '#bb86fc' : '#3f51b5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '16px',
  '& svg': {
    color: '#fff',
    fontSize: '24px',
  },
}));