const express = require("express");
const app = express();

app.get("/diylifestyle", (req, res) => {
  console.log("got it");
  res.send("Hello");
  //   res.render("homepage.ejs");
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port");
});
