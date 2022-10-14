const db = require("../../db/connection");
const users = require("../../db/data/test-data/users");

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

exports.addComment = (newComment, review_id) => {
  const { username, body } = newComment;
  let count = 0;
  users.forEach((user) => {
    if (username !== user.username) {
      count++;
    }
  });
  if (count === users.length) {
    return Promise.reject({
      status: 400,
      msg: "Invalid username",
    });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, review_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
