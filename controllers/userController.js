const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const controller = express.Router();

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
    res.redirect("/");
  } else {
    res.send("Wrong password!");
  }
});

// DESTROY SESSION
controller.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/?logout=true");
});

module.exports = controller;
