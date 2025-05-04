import React, { useEffect, useState } from 'react';
import {Container, Typography, TextField, Button, Box, Paper, Grid, Divider } from '@mui/material';

function UserPortal() {
  const [user, setUser] = useState(null);
  const [treeData, setTreeData] = useState('');
  const [savedTree, setSavedTree] = useState(null);
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
      // Prefill with user data if available
      setProfile({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        phone: parsedUser.phone || '',
        bio: parsedUser.bio || '',
      });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('userTreeData');
    if (saved) {
      setSavedTree(saved);
      setTreeData(saved);
    }
  }, []);

  const handleSaveTree = () => {
    localStorage.setItem('userTreeData', treeData);
    setSavedTree(treeData);
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

        {/* User profile info */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          <TextField
            label="First Name"
            fullWidth
            value={profile.firstName}
            onChange={handleProfileChange('firstName')}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={profile.lastName}
            onChange={handleProfileChange('lastName')}
          />
          <TextField
            label="Phone Number"
            fullWidth
            value={profile.phone}
            onChange={handleProfileChange('phone')}
            sx={{ gridColumn: { sm: 'span 1', xs: 'span 2' } }}
          />
          <TextField
            label="Short Bio"
            multiline
            rows={3}
            fullWidth
            value={profile.bio}
            onChange={handleProfileChange('bio')}
            sx={{ gridColumn: 'span 2' }}
          />
        </Box>

        {/* Tree Data Section */}
        <Typography variant="h6" gutterBottom>
          Your Tree Data
        </Typography>
        <TextField
          label="Enter your Tree Data"
          multiline
          rows={6}
          fullWidth
          value={treeData}
          onChange={(e) => setTreeData(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSaveTree}
        >
          Save Tree
        </Button>

        {savedTree && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Saved Tree:</Typography>
            <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', whiteSpace: 'pre-wrap' }}>
              {savedTree}
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default UserPortal;
