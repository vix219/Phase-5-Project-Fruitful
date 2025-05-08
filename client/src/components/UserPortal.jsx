import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';

function UserPortal() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfile({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        phone: parsedUser.phone || '',
        bio: parsedUser.bio || '',
      });
    }
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const { firstName, lastName, bio } = JSON.parse(savedProfile);
      setProfile({
        firstName,
        lastName,
        bio,
      });
    }
  }, []);

  const handleSaveBio = () => {
    const userProfile = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    alert('Profile saved!');
  };

  const handleProfileChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Please log in to access your portal.
        </Typography>
      </Container>
    );
  }

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

        {/* Profile Information */}
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            mb: 4,
          }}
        >
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <OutlinedInput
              id="firstName"
              value={profile.firstName}
              onChange={handleProfileChange('firstName')}
              label="First Name"
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="lastName">Last Name</InputLabel>
            <OutlinedInput
              id="lastName"
              value={profile.lastName}
              onChange={handleProfileChange('lastName')}
              label="Last Name"
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="bio">Short Bio</InputLabel>
            <OutlinedInput
              id="bio"
              value={profile.bio}
              onChange={handleProfileChange('bio')}
              label="Short Bio"
              multiline
              rows={4}
              sx={{ gridColumn: 'span 2' }}
            />
          </FormControl>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: '100%' }}
          onClick={handleSaveBio}
        >
          Save Profile
        </Button>

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
