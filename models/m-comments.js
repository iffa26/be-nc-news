const connection = require("../db/connection.js");

exports.ammendVotesOnComment = ({ comment_id }, { inc_votes }) => {
  //console.log("inside the ammendVotesOnComment model");
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then(response => {
      if (response.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found: comment_id does not exist"
        });
      }
      return response[0];
    });
};

exports.deleteCommentById = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(response => {
      if (response === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found: comment_id does not exist"
        });
      }
      return response;
    });
};
