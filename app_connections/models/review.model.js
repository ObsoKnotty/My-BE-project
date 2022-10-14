const db = require("../../db/connection");

exports.fetchAllReviews = (
  category,
  sort_by = "created_at",
  order = "DESC"
) => {
  const queryValue = [];
  const tester = order.toUpperCase();
  const validOrderList = ["ASC", "DESC"];
  const validSortList = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (!validSortList.includes(sort_by) || !validOrderList.includes(tester)) {
    return Promise.reject({ status: 400, msg: "invalid value given" });
  }
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) ::INT AS comment_count 
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id `;
  const queryWhere = `WHERE reviews.category = $1 `;
  const queryOrder = `ORDER BY ${sort_by} ${order};`;
  const queryGroup = `GROUP BY reviews.review_id `;

  if (category === undefined) {
    queryStr += queryGroup;
    queryValue.push((queryStr += queryOrder));
    return db.query(queryValue[0]).then(({ rows }) => {
      return rows;
    });
  } else {
    queryStr += queryWhere;
    queryStr += queryGroup;
    queryValue.push((queryStr += queryOrder));
    console.log(queryValue[0]);
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
