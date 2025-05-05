// Forum.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material';

function Forum({ currentUserId = null }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch posts on mount
  useEffect(() => {
    fetch('/forum_posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error loading posts:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      content,
      user_id: currentUserId,
    };

    const res = await fetch('/forum_posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    if (res.ok) {
      const createdPost = await res.json();
      setPosts([createdPost, ...posts]);
      setTitle('');
      setContent('');
    } else {
      alert('Failed to submit post.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Community Forum
      </Typography>

      {/* New Post Form */}
      <Paper elevation={3} sx={{ p: 5, mb: 8 }}>
        <Typography variant="h6" gutterBottom>
          Create a New Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Post Title"
            variant="outlined"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </Paper>

      {/* Posts List */}
      <Typography variant="h5" gutterBottom>
        Recent Posts
      </Typography>

      {posts.map(post => (
        <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Posted by {post.user?.username || 'Anonymous'} on{' '}
            {new Date(post.created_at).toLocaleString()}
          </Typography>
        </Paper>
      ))}
    </Container>
  );
}

export default Forum;
