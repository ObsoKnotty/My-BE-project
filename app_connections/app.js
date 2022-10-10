const { category, review } = require("./controllers/controller-index");
const { getCategories } = category;
const { getReview } = review;
//ask if there is a way to make above more neet
const express = require("express");
const app = express();
app.use(express.json());
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error" });
});
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});
module.exports = app;
