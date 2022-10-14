const db = require("../../db/connection");

exports.fetchComments = (review_id) => {
  return db
    .query(
      `SELECT *  FROM comments 
            WHERE review_id = $1 
            ORDER BY created_at DESC`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for review_id: ${review_id}`,
        });
      }
      return rows;
    });
};
