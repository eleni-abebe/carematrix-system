import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Link, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setIsSubmitting(true);
      await login(values);
      toast.success('Login successful!');
      // The AuthProvider will handle the redirection
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to log in');
      toast.error(error.message || 'Failed to log in');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: isFormSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage
                name="email"
                component="div"
                sx={{ color: 'error.main', mb: 2 }}
              />

              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage
                name="password"
                component="div"
                sx={{ color: 'error.main', mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting || isFormSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                sx={{ mt: 2 }}
              >
                Login
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="/register" variant="body2">
                  Don't have an account? Register
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
