// DEPENDENCIES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');

require('dotenv').config();
app.set('view engine', 'ejs');

// CONTROLLERS
const homepageController = require('./controllers/homepageController');
const postsController = require('./controllers/postsController');
const seedController = require('./controllers/seedController');
const userController = require('./controllers/userController');
const notFoundController = require('./controllers/notFoundController');

// CONFIG
const MONGO_URI = process.env.MONGO_URI;
const db = mongoose.connection;

// CONNECT TO MONGODB
mongoose.connect(
  MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log('The connection with mongod is established');
  }
);

// CHECK ERROR/SUCCESS
db.on('connected', () => console.log('My database is connected'));
db.on('error', (err) => console.log(`Got error! ${err.message}`));
db.on('disconnected', () => console.log('My database is disconnected'));

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// cookieSession config
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],
  })
);

app.use(flash()); // flash messages

//Logout
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

// USER LOGIN
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // One day in milliseconds
  })
);

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

// ROUTES
app.use(seedController);
app.use(homepageController);
app.use('/diylifestyle', postsController);
app.use('/users', userController);
app.use('/notFound', notFoundController);

// 404 MESSAGE
app.use('*', (req, res) => {
  res.status(404);
  res.redirect('/notFound');
  // res.send(
  //   '<h1>404 - Page is not found, please try again later &#128540;</h1>'
  // );
});

// ERR HANDLER
const errorHandler = (err, req, res, next) => {
  if (err) {
    res.send('<h1>There was an error, please try again later &#128540; </h1>');
  }
};
app.use(errorHandler);

// LISTEN
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});

// GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('Process is exiting...');
  server.close(() => {
    db.close();
  });
});
