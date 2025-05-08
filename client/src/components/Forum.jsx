import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText, Paper } from '@mui/material';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ user_id: '', title: '', content: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/forum_posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/forum_posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create post');
      await response.json(); // You could use this if you want the new post's data
      setFormData({ user_id: '', title: '', content: '' });
      fetchPosts(); // Refresh post list
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="User Name"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
          Post
        </Button>
      </Box>

      <Typography variant="h4" sx={{ marginTop: 4 }} gutterBottom>
        Forum Posts
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <List>
          {posts.map((post) => (
            <ListItem key={post.id}>
              <ListItemText
                primary={<Typography variant="h6">{post.title}</Typography>}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      {post.content}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      By User {post.user_id} on {new Date(post.created_at).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Forum;
