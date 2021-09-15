const express = require("express");
const Food = require("../models/food");
const controller = express.Router();

// GET -- user index page (Page with all items)
// controller.get("/index", async (req, res) => {
//   const results = await Food.find();
//   // Get query parameters success and action
//   // If have, we display alert banners
//   // If not, no alert banners should be displayed
//   const success = req.query.success;
//   const action = req.query.action;
//   res.render("posts/index", {
//     data: results,
//     success,
//     action,
//   });
// });

// controller.get("/index/:page", async (req, res) => {
//   const success = req.query.success;
//   const action = req.query.action;
//   // Pagination
//   const perPage = 4; // max num of items per page
//   const page = req.query.page || 1;
//   const results = await Food.find({})
//     .skip(perPage * page - perPage)
//     .limit(perPage)
//     .exec((err, food) => {
//       Food.countDocuments().exec((err, count) => {
//         if (err) return next(err);
//         res.render("posts/index", {
//           data: results,
//           current: page,
//           pages: Math.ceil(count / perPage),
//           success,
//           action,
//         });
//       });
//     });
// });

controller.get("/index/:page", async (req, res, next) => {
  const success = req.query.success;
  const action = req.query.action;
  const perPage = 4; // show 4 per pages
  const page = req.params.page || 1;

  await Food.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, food) => {
      Food.countDocuments().exec((err, count) => {
        if (err) return next(err);
        res.render("posts/index", {
          data: food,
          current: page,
          pages: Math.ceil(count / perPage),
          success,
          action,
        });
      });
    });
});

// USER index page (limit Food per page)
//localhost:3000/users/index?page=1&limit=6
// controller.get("/index", async (req, res) => {
//   const page = req.query.page;
//   const limit = req.query.limit;
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;
//   const results = await Food.find({}).skip(startIndex).limit(endIndex)
//   const success = req.query.success;
//   const action = req.query.action;
//   res.render("users/index.ejs", {
//     data: results,
//     success,
//     action,
//   });
// });

// NEW -- new.ejs
http: controller.get("/new", (req, res) => {
  res.render("posts/new");
});

// POST - add new items
controller.post("/index/:page", async (req, res) => {
  console.log(req.body);
  await Food.create(req.body);
  res.redirect("?success=true&action=create");
});

// SHOW -- show.ejs
controller.get("/:id", async (req, res) => {
  const item = await Food.findById(req.params.id);
  const success = req.query.success;
  const action = req.query.action;
  res.render("posts/show", {
    data: item,
    success,
    action,
  });
});

// EDIT -- edit.ejs
controller.get("/:id/edit", async (req, res) => {
  const item = await Food.findById(req.params.id);
  res.render("posts/edit", { data: item });
});

// PUT -- for editing
controller.put("/:id", async (req, res) => {
  await Food.updateOne({ _id: req.params.id }, req.body);
  console.log(req.body);
  res.redirect(`${req.params.id}?success=true&action=update`);
});

// DELETE
controller.delete("/index/:page/:id", async (req, res) => {
  await Food.deleteOne({ _id: req.params.id });
  res.redirect("/diylifestyle/index/1/?success=true&action=delete");
});

module.exports = controller;
