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

// MONGO QUERY PRACTICE
// Food.countDocuments({}, (err, data) => {
//   if (err) console.log(err.message);
//   console.log(`There are ${data} meal design in this database`);
// });

// (async () => {
//   // find all Meal Plans
//   // const allMeal = await Food.find();
//   // console.log(allMeal);

//   // find all Meal name only
//   const allMealNames = await Food.find({}, { name: 1, _id: 0 });
//   console.log(allMealNames);

//   // Find
//   const lemon = await Food.find({
//     ingredients: { $in: ["salmon", "asparagus"] },
//   });
//   console.log(lemon.length);
// })();

module.exports = controller;
