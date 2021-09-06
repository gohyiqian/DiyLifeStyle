const express = require("express");
const User = require("../models/users");
const Food = require("../models/food");
const bcrypt = require("bcrypt");
const controller = express.Router();
const session = require("express-session");

// USER index page (Page with all meal plans)
controller.get("/index", async (req, res) => {
  const results = await Food.find();
  // Get query parameters success and action
  // If have, we display alert banners
  // If not, no alert banners should be displayed
  const success = req.query.success;
  const action = req.query.action;
  res.render("users/index.ejs", {
    data: results,
    success,
    action,
  });
});

// USER SIGN UP
controller.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

controller.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.send("Ok, your account has been created.");
  } catch (err) {
    res.send(`Unable to create a new account: ${err.message}`);
  }
});

// USER LOG IN
controller.get("/login", (req, res) => {
  if (!req.session.username) {
    res.render("users/login.ejs");
  } else {
    res.redirect("/");
  }
});

controller.post("/login", async (req, res) => {
  const selectedUser = await User.findOne({
    username: req.body.username,
  });
  if (!selectedUser) {
    return res.send("Username does not exist");
  }

  if (bcrypt.compareSync(req.body.password, selectedUser.password)) {
    req.session.username = selectedUser.username;
    res.redirect("/users/index");
  } else {
    res.send("Wrong password!");
  }
});

// USER CALENDAR
controller.get("/calendar/:id", async (req, res) => {
  const item = await Food.findById(req.params.id);
  res.render("users/calendar.ejs", {
    data: item,
  });
});

// DESTROY SESSION
controller.get("/logout", (req, res) => {
  // req.session.destroy(); // if using express-session
  req.session = null; // if using cookie-session
  res.redirect("/?logout=true");
  // const logout = req.query.logout;
  // console.log(logout);
  // res.render("users/login.ejs", {
  //   logout,
  // });
});

module.exports = controller;
