import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  address: Yup.string()
    .required('Address is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setIsSubmitting(true);
      
      // Prepare registration data
      const { confirmPassword, ...registrationData } = values;
      
      await register(registrationData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      toast.error(error.message || 'Registration failed');
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
          Register
        </Typography>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: isFormSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="firstName"
                label="First Name"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                sx={{ color: 'error.main', mb: 2 }}
              />

              <Field
                as={TextField}
                name="lastName"
                label="Last Name"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                sx={{ color: 'error.main', mb: 2 }}
              />

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

              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                sx={{ color: 'error.main', mb: 2 }}
              />

              <Field
                as={TextField}
                name="phone"
                label="Phone Number"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage
                name="phone"
                component="div"
                sx={{ color: 'error.main', mb: 2 }}
              />

              <Field
                as={TextField}
                name="address"
                label="Address"
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
              />
              <ErrorMessage
                name="address"
                component="div"
                sx={{ color: 'error.main', mb: 2 }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting || isFormSubmitting}
                sx={{ mt: 2, mb: 2 }}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Register;
