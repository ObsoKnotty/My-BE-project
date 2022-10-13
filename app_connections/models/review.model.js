const db = require("../../db/connection");

exports.fetchAllReviews = (category) => {
  const queryValue = [];
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) ::INT AS comment_count 
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id `;
  const queryWhere = `WHERE reviews.category = $1 `;
  const queryGroup = `GROUP BY reviews.review_id;`;

  if (category === undefined) {
    queryValue.push((queryStr += queryGroup));
    return db.query(queryValue[0]).then(({ rows }) => {
      return rows;
    });
  } else {
    queryStr += queryWhere;
    queryValue.push((queryStr += queryGroup));
    return db.query(queryValue[0], [category]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Category ${category} does not exist`,
        });
      }
      return rows;
    });
  }
};

exports.fetchReview = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) ::INT AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON comments.review_id = reviews.review_id 
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id;`,
      [review_id]
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
