const {
  category,
  review,
  users,
  comments,
  api,
} = require("./controllers/controller-index");

const cors = require("cors");

const { getApi } = api;
const { getCategories } = category;
const { getReview, patchReview, getAllReviews } = review;
const { getUsers } = users;
const { getComments, postComment, deleteComment } = comments;

const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/api", getApi);
app.get("/api/reviews", getAllReviews);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", patchReview);
app.post("/api/reviews/:review_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

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
  res.status(500).send({ msg: "Server Error" });
});

// Mispelled path
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

module.exports = app;
