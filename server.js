// DEPENDENCIES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv").config();

// CONGFIG
const mongoURI = "mongodb://localhost:27017/storageWeb";
const port = 3000;

// MODELS

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

// GET
app.get("/diylifestyle", (req, res) => {
  console.log("got it");
  res.render("homepage.ejs");
});

// LISTEN
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});

// GRACEFUL SHUTDOWN
process.on("SIGTERM", () => {
  console.log("Process is exiting...");

  server.close(() => {
    dbConnection.close();
  });
});
