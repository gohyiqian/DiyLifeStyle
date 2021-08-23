const mongoose = require("mongoose");

// Create the food Schema
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, max: 2000 },
    nutrition: {
      carbohydrates: String,
      fat: String,
      cholesterol: String,
      sodium: String,
      potassium: String,
      protein: String,
    },
    vitamins: {
      a: String,
      b12: String,
      b6: String,
      c: String,
      d: String,
      e: String,
    },
    ingredients: [String],
    readyToEat: Boolean,
    scheduled: Boolean,
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", fruitSchema);

module.exports = Food;
