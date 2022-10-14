const { fetchComments } = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  const review_id = req.params.review_id;
  fetchComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
