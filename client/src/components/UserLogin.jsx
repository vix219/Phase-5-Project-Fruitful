import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';



function UserLogin() {
  const [signup, setSignUp] = useState(true);
  const [user, setUser] = useState(null);


  // Toggle between login/signup
  const toggleFormMode = () => {
    setSignUp(prev => !prev);
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
  const handleFormSubmit = (values) => {
    const endpoint = signup ? '/users' : '/login';

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
          response.json().then(user => {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            setUser(user);
          });
        } else {
          response.json().then(data => {
            const errorMessage = data.error || 'Login/Register failed';
          });
        }
      })
      .catch(err => {
        console.error('Network error:', err);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {signup ? 'Register for an Account' : 'Login to Your Account'}
      </Typography>

      <Button variant="text" onClick={toggleFormMode} sx={{ mb: 2 }}>
        {signup ? 'Already have an account? Login' : 'Need an account? Register'}
      </Button>

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
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>

          </Box>
        )}
      </Formik>

    
    </Container>
  );
}

export default UserLogin;
