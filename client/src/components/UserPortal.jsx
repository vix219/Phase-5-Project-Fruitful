// Import necessary modules and components from React and Material UI
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

function UserPortal() {
  // State to store user object (null by default until loaded from localStorage)
  const [user, setUser] = useState(null);

  // State to manage profile information with initial empty values
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  });

  // useEffect runs once on component mount to load logged-in user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      // Parse JSON string into JS object
      const parsedUser = JSON.parse(storedUser);

      // Set user state with retrieved data
      setUser(parsedUser);

      // Initialize profile state using available data (fallback to empty strings)
      setProfile({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        phone: parsedUser.phone || '',
        bio: parsedUser.bio || '',
      });
    }
  }, []);

  // useEffect to load separately saved user profile (could override user-provided info)
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const { firstName, lastName, bio } = JSON.parse(savedProfile);
      // Overwrite profile with saved profile data
      setProfile({
        firstName,
        lastName,
        bio,
      });
    }
  }, []);

  // Save the profile data (firstName, lastName, bio) to localStorage
  const handleSaveBio = () => {
    const userProfile = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    alert('Profile saved!');
  };

  // Higher-order function: returns an event handler for updating individual fields
  const handleProfileChange = (field) => (e) => {
    // Update only the changed field using dynamic key assignment
    setProfile({ ...profile, [field]: e.target.value });
  };

  // If no user is logged in, show a message instead of the profile UI
  if (!user) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Please log in to access your portal.
        </Typography>
      </Container>
    );
  }

  // Main UI rendering when user is logged in
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.username}!
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Email: {user.email}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Profile Input Section */}
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>

        <Box
          sx={{
            display: 'grid', // Use CSS Grid for layout
            gap: 3, // Gap between grid items
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, // Responsive column layout
            mb: 4,
          }}
        >
          {/* First Name Input */}
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <OutlinedInput
              id="firstName"
              value={profile.firstName}
              onChange={handleProfileChange('firstName')}
              label="First Name"
            />
          </FormControl>

          {/* Last Name Input */}
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="lastName">Last Name</InputLabel>
            <OutlinedInput
              id="lastName"
              value={profile.lastName}
              onChange={handleProfileChange('lastName')}
              label="Last Name"
            />
          </FormControl>

          {/* Bio Input Field */}
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="bio">Short Bio</InputLabel>
            <OutlinedInput
              id="bio"
              value={profile.bio}
              onChange={handleProfileChange('bio')}
              label="Short Bio"
              multiline
              rows={4} // Make it a multi-line input
              sx={{ gridColumn: 'span 2' }} // Span across both columns in grid layout
            />
          </FormControl>
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: '100%' }}
          onClick={handleSaveBio}
        >
          Save Profile
        </Button>

        {/* Conditional rendering: Show summary only if all fields are filled */}
        {profile.firstName && profile.lastName && profile.bio && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Your Profile:</Typography>
            <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', whiteSpace: 'pre-wrap' }}>
              <strong>Name:</strong> {profile.firstName} {profile.lastName}
              <br />
              <strong>Bio:</strong> {profile.bio}
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default UserPortal;
