const Blog = require('../models/blog');

const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .populate('author', 'username') // Populate username
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).render('404', { title: 'Error loading blogs' });
    });
};

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .populate('author', 'username') // Populate username
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
      res.status(404).render('404', { title: 'Blog not found' });
    });
};

const blog_create_get = (req, res) => {
  res.render('create', { title: 'Create a new blog' });
};

const blog_create_post = (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body,
    author: req.session.userId
  });
  
  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
      res.render('create', { 
        title: 'Create a new blog', 
        error: 'Failed to create blog' 
      });
    });
};

const user_blogs = (req, res) => {
  Blog.find({ author: req.session.userId }).sort({ createdAt: -1 })
    .populate('author', 'username') // Populate username
    .then(blogs => {
      res.render('my-blogs', { blogs, title: 'My Blogs' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).render('404', { title: 'Error loading your blogs' });
    });
};

// Add these functions to your existing blogController.js

const blog_edit_get = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(blog => {
      if (!blog.author.equals(req.session.userId)) {
        return res.redirect('/blogs');
      }
      res.render('edit', { blog, title: 'Edit Blog' });
    })
    .catch(err => {
      res.redirect('/blogs');
    });
};

const blog_edit_post = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(blog => {
      if (!blog.author.equals(req.session.userId)) {
        return res.redirect('/blogs');
      }
      return Blog.findByIdAndUpdate(id, {
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body
      });
    })
    .then(() => {
      res.redirect('/blogs/my');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/blogs');
    });
};

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(blog => {
      if (!blog.author.equals(req.session.userId)) {
        return res.status(403).json({ redirect: '/blogs' });
      }
      return Blog.findByIdAndDelete(id);
    })
    .then(() => {
      res.json({ redirect: '/blogs/my' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ redirect: '/blogs' });
    });
};

// Update your module.exports to include the new functions
module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  user_blogs,
  blog_edit_get,      // NEW
  blog_edit_post,     // NEW
  blog_delete
};
