// DEPENDENCIES
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv").config();

// CONGFIG
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// Controllers
const homepageController = require("./controllers/homepageController");
const postsController = require("./controllers/postsController");
const seedController = require("./controllers/seedController");
const userController = require("./controllers/userController");

// MODELS
const foodSeed = require("./models/seeds");
const Food = require("./models/food");
const User = require("./models/users");

// CONNECT TO MONGODB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("The connection with mongod is established");
  }
);

// CHECK ERROR/SUCCESS
db.on("connected", () => console.log("My database is connected"));
db.on("error", (err) => console.log(`Got error! ${err.message}`));
db.on("disconnected", () => console.log("My database is disconnected"));

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(homepageController);
app.use("/diylifestyle", postsController);

// USER LOGIN
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

app.post("/users/signup", async (req, res) => {
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

// GET - login
app.get("/login", (req, res) => {
  if (!req.session.username) {
    res.render("users/login.ejs");
  } else {
    res.redirect("/");
  }
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
