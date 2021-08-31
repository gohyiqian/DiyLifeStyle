// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();

// CONTROLLERS
const homepageController = require("./controllers/homepageController");
const postsController = require("./controllers/postsController");
const seedController = require("./controllers/seedController");
const userController = require("./controllers/userController");

// CONGFIG
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

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

// ROUTER
app.use(homepageController);
app.use("/diylifestyle", postsController);
app.use(seedController);
app.use("/users", userController);

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

// 404 MESSAGE
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
