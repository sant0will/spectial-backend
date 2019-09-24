const express = require('express');
const routes = express.Router();

routes.get('/', function (req, res) {
  return({ ok: "Hello"})
});


module.exports = routes;

