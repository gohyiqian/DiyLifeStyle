// DEPENDENCIES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const { google } = require('googleapis'); // Require oAuth2 from google instance.
const { OAuth2 } = google.auth;
const cookieSession = require('cookie-session');
const flash = require('connect-flash');

require('dotenv').config();
app.set('view engine', 'ejs');

// CONTROLLERS
const homepageController = require('./controllers/homepageController');
const postsController = require('./controllers/postsController');
const seedController = require('./controllers/seedController');
const userController = require('./controllers/userController');
const googleOAuthController = require('./controllers/googleOAuthController');
const notFoundController = require('./controllers/notFoundController');

// CONFIG
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// CONNECT TO MONGODB
mongoose.connect(
  MONGO_URL,
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

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions
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
app.use(homepageController);
app.use('/diylifestyle', postsController);
app.use(seedController);
app.use('/users', userController);
app.use('/auth', googleOAuthController);
app.use('/notFound', notFoundController);

///////////////////// Google Calendar Test ///////////////////
// Create a new instance of oAuth and set Client ID & Client Secret
const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Call the setCredentials method on our oAuth2Client instance and set refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client }); // Create a new calender instance.
// Create a new event start date instance for temp uses in calendar.
// 7 numbers specify year, month, day, hour, minute, second, and millisecond (in that order):
const eventStartTime = new Date(2021, 8, 14, 8, 30, 0, 0);
// const eventStartTime = new Date();
// eventStartTime.setDate(eventStartTime.getDay());

// Create a new event end date instance for temp uses in calendar.
// 0->Jan, 1->Feb ... 8->Sep
const eventEndTime = new Date(2021, 8, 15, 10, 30, 0, 0);
// const eventEndTime = new Date();
// eventEndTime.setDate(eventEndTime.getDay() + 4);
// eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

// Create a dummy event for temp uses in calendar
const event = {
  summary: `Arugula & Chickpea Salad`,
  location: `Singapore Bedok`,
  description: `Meet with David to talk about the new client project and how to integrate the calendar for booking.`,
  start: {
    dateTime: eventStartTime,
    timeZone: 'America/Denver',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'America/Denver',
  },
  colorId: 6,
};

///////////////////// Google Calendar Test  ///////////////////

// 404 MESSAGE
app.use('*', (req, res) => {
  res.status(404);
  res.redirect('/notFound');
  res.send(
    '<h1>404 - Page is not found, please try again later &#128540;</h1>'
  );
});

// ERR HANDLER
const errorHandler = (err, req, res, next) => {
  if (err) {
    res.send('<h1>There was an error, please try again later &#128540; </h1>');
  }
  res.json({ err: err });
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
