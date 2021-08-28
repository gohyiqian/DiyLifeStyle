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
db.on("connected", () => console.log("My database is connected"));
db.on("error", (err) => console.log(`Got error! ${err.message}`));
db.on("disconnected", () => console.log("My database is disconnected"));

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use((req, res, next) => {
//   res.locals.username = req.session.username;
//   next();
// });

// SEEDING
app.get("/seeds", async (req, res) => {
  try {
    // await Food.collection.drop();
    await Food.create(foodSeed);
    res.send("Food seeded successfully");
  } catch (err) {
    console.log("Read Error Message here: ", err);
  }
});

// GET -- homepage page
app.get("/", async (req, res) => {
  res.render("posts/homepage.ejs");
});

// GET - loginpage.ejs
app.get("/diylifestyle/login", (req, res) => {
  res.render("users/loginpage.ejs");
});

// GET -- index page (Page with all items)
app.get("/diylifestyle/index", async (req, res) => {
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

// NEW -- new.ejs
app.get("/diylifestyle/new", (req, res) => {
  res.render("posts/new.ejs");
});

// POST - add new items
app.post("/diylifestyle", async (req, res) => {
  console.log(req.body);
  await Food.create(req.body);
  res.redirect("/diylifestyle/index?success=true&action=create");
});

// SHOW -- show.ejs
app.get("/diylifestyle/:id", async (req, res) => {
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
app.get("/diylifestyle/:id/edit", async (req, res) => {
  const item = await Food.findById(req.params.id);
  res.render("posts/edit.ejs", { data: item });
});

// PUT -- for editing
app.put("/diylifestyle/:id", async (req, res) => {
  await Food.updateOne({ _id: req.params.id }, req.body);
  console.log(req.body);
  res.redirect(`/diylifestyle/${req.params.id}?success=true&action=update`);
});

// DELETE
app.delete("/diylifestyle/:id", async (req, res) => {
  await Food.deleteOne({ _id: req.params.id });
  res.redirect("/diylifestyle/index/?success=true&action=delete");
});

app.use("*", (req, res) => {
  res.status(404);
  res.send("Page is not found");
});

// LISTEN
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});

// GRACEFUL SHUTDOWN
process.on("SIGTERM", () => {
  console.log("Process is exiting...");

  server.close(() => {
    db.close();
  });
});
