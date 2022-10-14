const { fetchComments, addComment } = require("../models/comments.model");

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

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const review_id = req.params.review_id;
  addComment(newComment, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
