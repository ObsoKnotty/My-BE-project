const db = require("../../db/connection");

exports.fetchReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Review does not exist" });
      }
      return rows;
    });
};
