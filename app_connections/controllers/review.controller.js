const { response } = require("../app");
const { fetchReview } = require("../models/review.model");

exports.getReview = (req, res, next) => {
  const review_id = req.params.review_id;
  fetchReview(review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};
