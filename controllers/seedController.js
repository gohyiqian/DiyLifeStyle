const express = require("express");
const Food = require("../models/food");
const controller = express.Router();

// SEEDING
controller.get("/seeds", async (req, res) => {
  try {
    // await Food.collection.drop();
    await Food.create(foodSeed);
    res.send("Food seeded successfully");
  } catch (err) {
    console.log("Read Error Message here: ", err);
  }
});

module.exports = controller;
