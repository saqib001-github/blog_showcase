const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// GET /posts: Retrieve all blog posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /posts/:id: Retrieve a single blog post by ID
app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /posts: Create a new blog post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;

  // Validation: Ensure title and content are required
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const newPost = await prisma.post.create({
      data: { title, content },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// DELETE /posts/:id: Delete a blog post by ID
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedPost);
  } catch (error) {
    res.status(404).json({ error: 'Post not found' });
  }
});

// PUT /posts/:id: Update a blog post by ID
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Validation: Ensure title and content are required
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    res.json(updatedPost);
  } catch (error) {
    if (error.code === 'P2025') { // Prisma error code for "Record to update not found"
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
