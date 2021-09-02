const express = require("express");
const Food = require("../models/food");
const controller = express.Router();

// GET -- index page (Page with all items)
controller.get("/index", async (req, res) => {
  const results = await Food.find();
  // Get query parameters success and action
  // If have, we display alert banners
  // If not, no alert banners should be displayed
  const success = req.query.success;
  const action = req.query.action;
  res.render("posts/index.ejs", {
    data: results,
    success,
    action,
  });
});

// GET - login.ejs
controller.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// GET - signup.ejs
controller.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// NEW -- new.ejs
controller.get("/new", (req, res) => {
  res.render("posts/new.ejs");
});

// POST - add new items
controller.post("", async (req, res) => {
  console.log(req.body);
  await Food.create(req.body);
  res.redirect("diylifestyle/index?success=true&action=create");
});

// SHOW -- show.ejs
controller.get("/:id", async (req, res) => {
  const item = await Food.findById(req.params.id);
  const success = req.query.success;
  const action = req.query.action;
  res.render("posts/show.ejs", {
    data: item,
    success,
    action,
  });
});

// EDIT -- edit.ejs
controller.get("/:id/edit", async (req, res) => {
  const item = await Food.findById(req.params.id);
  res.render("posts/edit.ejs", { data: item });
});

// PUT -- for editing
controller.put("/:id", async (req, res) => {
  await Food.updateOne({ _id: req.params.id }, req.body);
  console.log(req.body);
  res.redirect(`${req.params.id}?success=true&action=update`);
});

// DELETE
controller.delete("/:id", async (req, res) => {
  await Food.deleteOne({ _id: req.params.id });
  res.redirect("index/?success=true&action=delete");
});

module.exports = controller;
