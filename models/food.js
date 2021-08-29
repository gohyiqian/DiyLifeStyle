const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Food Schema
const foodSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    img: String,
    price: { type: Schema.Types.Decimal128, required: true, min: 0.01 },
    qty: { type: Number, required: true },
    calories: { type: Number, max: 2000, required: true },
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
    toppings: [String],
    // readyToEat: Boolean,
    // scheduled: Boolean,
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
