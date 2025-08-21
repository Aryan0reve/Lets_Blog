const express = require('express');
const blogController = require('../controllers/blogController');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', blogController.blog_index);

// Protected routes
router.get('/create', isLoggedIn, blogController.blog_create_get);
router.get('/my', isLoggedIn, blogController.user_blogs);
router.get('/edit/:id', isLoggedIn, blogController.blog_edit_get);  // NEW
router.put('/:id', isLoggedIn, blogController.blog_edit_post);      // NEW
router.delete('/:id', isLoggedIn, blogController.blog_delete);      // NEW
router.post('/', isLoggedIn, blogController.blog_create_post);

// Details route (MUST be last)
router.get('/:id', blogController.blog_details);

module.exports = router;
