import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/userSchema';
import type { RegisterInput } from '../schemas/userSchema';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const registerUser = async (data: RegisterInput) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const Home: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  // ⬇️ Form and modal state
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setOpen(false);
      reset();
    },
  });

  const onSubmit = (data: RegisterInput) => {
    mutation.mutate(data);
  };

  return (
    <Container   maxWidth="xs"
  sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',  // align to top vertically
    alignItems: 'center',          // center horizontally
    minHeight: '100vh',
    paddingTop: 4,                 // space from top (you can adjust the value)
  }}>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to Resource App
      </Typography>

      {user ? (
        <Box>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Hello, {user.username}!
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              logout();
              localStorage.removeItem('token');
            }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Please login or register to access your resources.
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                reset();
                setOpen(true);
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      )}

      {/* Register Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center' }}>Register</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {mutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {(mutation.error as any)?.response?.data?.message || 'Registration failed'}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={mutation.isPending}
            startIcon={mutation.isPending? <CircularProgress size={20} /> : null}
          >
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Container>
  );
};
