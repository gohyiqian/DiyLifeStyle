const express = require('express');
const controller = express.Router();

controller.get('/', async (req, res) => {
  res.render('errorPage/notFound');
});

module.exports = controller;
