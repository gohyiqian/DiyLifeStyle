const express = require("express");
const Food = require("../models/food");
const controller = express.Router();

// GET -- homepage page
controller.get("/", async (req, res) => {
  res.render("posts/homepage");
});

module.exports = controller;
