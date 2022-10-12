const db = require("../../db/connection");

exports.fetchReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${review_id}`,
        });
      }
      return rows;
    });
};

exports.editReview = (review_id, inc_vote) => {
  if (typeof inc_vote !== "number") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`,
    });
  } else {
    return db
      .query(
        `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
        [inc_vote, review_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `No review found for review_id: ${review_id}`,
          });
        }
        return rows;
      });
  }
};
