const { getCategories } = require("./controllers/category.controller");

const express = require("express");
const app = express();
// app.use(express.json());
app.get("/api/categories", getCategories);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});
module.exports = app;
