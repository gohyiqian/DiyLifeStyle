// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv").config();

// CONGFIG
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// MODELS
const foodSeed = require("./models/seeds.js");
const Food = require("./models/food.js");

// CONNECT TO MONGO
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("The connection with mongod is established");
  }
);

// ERROR/SUCCESS
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", mongoURI));
db.on("disconnected", () => console.log("mongo disconnected"));

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

// SEEDING
// app.get("/seeds", async (req, res) => {
//   try {
//     // await Food.collection.drop();
//     await Food.create(foodSeed);
//     res.send("Food seeded successfully");
//   } catch (err) {
//     console.log("Read Error Message here: ", err);
//   }
// });

// GET -- index page (Main Store Page)
app.get("/diylifestyle", async (req, res) => {
  const results = await Food.find();
  // Get query parameters success and action
  // If have, we display alert banners
  // If not, no alert banners should be displayed
  const success = req.query.success;
  const action = req.query.action;
  res.render("posts/homepage.ejs", {
    data: results,
    success,
    action,
  });
});

// GET - loginpage.ejs
app.get("/diylifestyle/login", (req, res) => {
  res.render("posts/loginpage.ejs");
});

// NEW -- new.ejs
app.get("/product/new", (req, res) => {
  res.render("posts/new.ejs");
});

// LISTEN
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});

// GRACEFUL SHUTDOWN
// process.on("SIGTERM", () => {
//   console.log("Process is exiting...");

//   server.close(() => {
//     db.close();
//   });
// });
