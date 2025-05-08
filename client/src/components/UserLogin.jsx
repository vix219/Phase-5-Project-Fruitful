import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const [signup, setSignUp] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For redirecting after login or signup

  // Toggle between login/signup
  const toggleFormMode = () => {
    setSignUp(prev => !prev);
    setError(null); // Clear error on toggle
  };

  // Yup validation schemas
  const signupSchema = yup.object().shape({
    username: yup.string().min(5).max(15).required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(5).max(15).required('Password is required'),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const loginSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  // Initial form values
  const initialSignupValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const initialLoginValues = {
    username: '',
    password: '',
  };

  // Handle form submission
  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    setError(null);

    const endpoint = signup ? '/users' : '/users/login';
    const payload = signup
      ? {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      : {
          username: values.username,
          password: values.password,
        };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          return response.json().then(user => {
            // Store user in localStorage with session expiration
            const sessionExpiration = new Date().getTime() + 3600000; // 1 hour session expiration
            const userWithExpiration = { ...user, sessionExpiration };
            localStorage.setItem('loggedInUser', JSON.stringify(userWithExpiration)); // Store user with expiration

            resetForm();
            navigate('/portal'); // Redirect to the user portal after successful login/signup
            alert(`${signup ? 'Registration' : 'Login'} successful!`);
          });
        } else {
          return response.json().then(data => {
            setError(data.error || 'Login/Register failed');
          });
        }
      })
      .catch(err => {
        console.error('Network error:', err);
        setError('A network error occurred. Please try again later.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Check if user session is valid
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      const currentTime = new Date().getTime();

      // If session has expired, clear the user data from localStorage
      if (currentTime > parsedUser.sessionExpiration) {
        localStorage.removeItem('loggedInUser');
        alert('Your session has expired. Please log in again.');
      } else {
        navigate('/portal'); // Redirect to portal if valid session
      }
    }
  }, [navigate]);

  // Logout function
  const logout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login'); // Redirect to login page after logout
    alert('You have logged out successfully.');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {signup ? 'Register for an Account' : 'Login to Your Account'}
      </Typography>

      <Button variant="text" onClick={toggleFormMode} sx={{ mb: 2 }}>
        {signup ? 'Already have an account? Login' : 'Need an account? Register'}
      </Button>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Formik
        enableReinitialize
        initialValues={signup ? initialSignupValues : initialLoginValues}
        validationSchema={signup ? signupSchema : loginSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, values, handleChange, errors, touched, isSubmitting }) => (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={values.username}
              onChange={handleChange}
              error={touched.username && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              autoComplete="username"
            />

            {signup && (
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                autoComplete="email"
              />
            )}

            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={values.password}
              onChange={handleChange}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              autoComplete={signup ? 'new-password' : 'current-password'}
            />

            {signup && (
              <TextField
                name="passwordConfirmation"
                label="Confirm Password"
                type="password"
                fullWidth
                value={values.passwordConfirmation}
                onChange={handleChange}
                error={touched.passwordConfirmation && Boolean(errors.passwordConfirmation)}
                helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                autoComplete="new-password"
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : signup ? 'Register' : 'Login'}
            </Button>
          </Box>
        )}
      </Formik>

    
    </Container>
  );
}

export default UserLogin;
