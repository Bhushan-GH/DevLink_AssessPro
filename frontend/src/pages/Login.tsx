// src/pages/Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useUserStore } from '../store/userStore';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

const loginUser = async (data: LoginInput) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const Login: React.FC = () => {
  const { login } = useUserStore();
  const navigate=useNavigate();
const mutation = useMutation<any, Error, LoginInput>({
  mutationFn: loginUser,
  onSuccess: (data) => {
    login(data);
    navigate('/collection',{ replace: true }); // redirect to collection page
    localStorage.setItem('token', data.token);
  },
});


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => mutation.mutate(data);

  return (
  <Container
    maxWidth="xs"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',  // vertical center
      alignItems: 'center',      // horizontal center
      minHeight: '100vh',
      px: 2,
    }}
  >
    <Typography variant="h4" component="h1" gutterBottom align="center">
      Login
    </Typography>

    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: '100%' }}
    >
      <TextField
        label="Email"
        margin="normal"
        fullWidth
        autoComplete="email"
        autoFocus
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        margin="normal"
        fullWidth
        autoComplete="current-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      {mutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {(mutation.error as any)?.response?.data?.message || 'Login failed'}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={mutation.status === 'pending'}
        startIcon={mutation.status === 'pending' ? <CircularProgress size={20} /> : null}
      >
        {mutation.status === 'pending' ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  </Container>
);
};
