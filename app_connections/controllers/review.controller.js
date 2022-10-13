const { response } = require("../app");
const {
  fetchReview,
  editReview,
  fetchAllReviews,
} = require("../models/review.model");

exports.getAllReviews = (req, res) => {
  fetchAllReviews().then((reviews) => {
    console.log(reviews);
    res.status(200).send({ reviews });
  });
};

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

exports.patchReview = (req, res, next) => {
  const review_id = req.params.review_id;
  const inc_vote = req.body.inc_vote;
  fetchReview(review_id)
    .then((review) => {
      const rev = review[0];
      editReview(review_id, inc_vote)
        .then((editedReview) => {
          res.status(201).send({
            editedReview,
            msg: `Votes on review ${review_id} have changed from ${rev.votes} to ${editedReview[0].votes}`,
          });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};
