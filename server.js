const express = require("express");
const app = express();
const session = require("express-session");

require("dotenv").config();

app.use(express.static("public"));

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

app.get("/diylifestyle", (req, res) => {
  console.log("got it");
  res.render("homepage.ejs");
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});
