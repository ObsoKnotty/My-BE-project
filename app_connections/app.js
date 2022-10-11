const { category, review } = require("./controllers/controller-index");
const { getCategories } = category;
const { getReview } = review;
//ask if there is a way to make above more neet
const express = require("express");
const app = express();
app.use(express.json());
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);

//Custom Error
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//PSQL Error
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

// Internal Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error" });
});

// Mispelled path
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

module.exports = app;
