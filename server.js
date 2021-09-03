// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const cookieSession = require("cookie-session");
require("dotenv").config();

// MODELS
const User = require("./models/users");

// CONTROLLERS
const homepageController = require("./controllers/homepageController");
const postsController = require("./controllers/postsController");
const seedController = require("./controllers/seedController");
const userController = require("./controllers/userController");

// CONGFIG
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// CONNECT TO MONGODB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("The connection with mongod is established");
  }
);

// CHECK ERROR/SUCCESS
db.on("connected", () => console.log("My database is connected"));
db.on("error", (err) => console.log(`Got error! ${err.message}`));
db.on("disconnected", () => console.log("My database is disconnected"));

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// cookieSession config
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ["randomstringhere"],
  })
);

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("You must login!");
  }
}

// Strategy config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile); // passes the profile data to serializeUser
    }
  )
);

// GET /auth/google
// passport.authenticate middleware is used here to authenticate the request
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Used to specify the required data
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the index page.
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "diylifestyle/login" }),
  (req, res) => {
    res.redirect("/diylifestyle/index");
  }
);

// USER LOGIN
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

// ROUTER
app.use(homepageController);
app.use("/diylifestyle", postsController);
app.use(seedController);
app.use("/users", userController);

// 404 MESSAGE
app.use("*", (req, res) => {
  res.status(404);
  res.send("Page is not found");
});

// ERR HANDLER
function errorHandler(err, req, res, next) {
  if (err) {
    res.send("<h1>There was an error, please try again later &#128540; </h1>");
  }
  res.json({ err: err });
}
app.use(errorHandler);

// LISTEN
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});

// GRACEFUL SHUTDOWN
process.on("SIGTERM", () => {
  console.log("Process is exiting...");
  server.close(() => {
    db.close();
  });
});
