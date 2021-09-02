const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const controller = express.Router();
const session = require("express-session");

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
    res.redirect("/diylifestyle/index");
  } else {
    res.send("Wrong password!");
  }
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
