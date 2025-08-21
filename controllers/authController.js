const User = require('../models/user');

const signup_get = (req, res) => {
  res.render('signup', { title: 'Sign Up' });
};

const signup_post = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    
    // Auto-login after signup
    req.session.userId = user._id;
    req.session.username = user.username; // Store username in session
    res.redirect('/blogs');
    
  } catch (error) {
    let errorMessage = 'Registration failed';
    if (error.code === 11000) {
      if (error.keyValue.email) {
        errorMessage = 'Email already exists';
      } else if (error.keyValue.username) {
        errorMessage = 'Username already exists';
      }
    }
    res.render('signup', { 
      title: 'Sign Up', 
      error: errorMessage 
    });
  }
};

const login_get = (req, res) => {
  res.render('login', { title: 'Log In' });
};

const login_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id;
      req.session.username = user.username; // Store username in session
      return res.redirect('/blogs');
    }
    
    res.render('login', { 
      title: 'Log In', 
      error: 'Invalid email or password' 
    });
  } catch (error) {
    res.render('login', { 
      title: 'Log In', 
      error: 'Login failed. Please try again.' 
    });
  }
};

const logout_get = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get
};
