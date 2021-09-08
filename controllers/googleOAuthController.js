const express = require("express");
const User = require("../models/users");
const Food = require("../models/food");
const controller = express.Router();
const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;

// To stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// To decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Strategy config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    // Passport callback function
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      done(null, profile); // passes the profile data to serializeUser
    }
  )
);

// GET: /auth/google
// passport.authenticate middleware is used here to authenticate the request
controller.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Used to specify the required data
  })
);

// GET: /auth/google/callback
// If authentication fails, the user  be redirected back to login page.
// If authentication succeeds, the user  be redirected back to index page.
controller.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/profile",
    failureRedirect: "diylifestyle/login",
    failureFlash: true,
    successFlash: true,
  })
);

// Middleware - Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

// Display GoogleOAuth Login Success Page
controller.get("/profile", checkUserLoggedIn, (req, res) => {
  // res.send(`<h1>${req.user.displayName}'s Profile Page</h1>`);
  res.render("users/success", { user: req.user });
});

module.exports = controller;
