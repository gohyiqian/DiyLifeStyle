const express = require("express");
const app = express();

require("dotenv").config();

app.get("/diylifestyle", (req, res) => {
  console.log("got it");
  res.send("Hello World");
  //   res.render("homepage.ejs");
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});
