const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = process.env.MONGODB_URI || 'mongodb+srv://aryanreve:Hellomom123@cluster0asteroid.yenqwf9.mongodb.net/data_atom?retryWrites=true&w=majority&appName=Cluster0asteroid';

mongoose.connect(dbURI)
  .then(result => {
    console.log('✅ Connected to MongoDB Atlas');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => console.log('❌ Connection error:', err));

// register view engine
app.set('view engine', 'ejs');

// session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || '68d8e0af0ea91ab17f405cadb385117417fc30a71a92270a93fb65259e0c39aa',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: dbURI }),
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: false // set to true in production with HTTPS
  }
}));

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// method override for PUT requests
app.use(methodOverride('_method'));

// make user data available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  res.locals.currentUsername = req.session.username;
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// auth routes
app.use(authRoutes);

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
