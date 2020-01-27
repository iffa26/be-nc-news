const commentsRouter = require("express").Router();
const {
  updateCommentVotes,
  removeCommentById
} = require("../controllers/c-comments.js");
const { send405Error } = require("../errors/errors.js");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentVotes)
  .delete(removeCommentById)
  .all(send405Error);

module.exports = commentsRouter;
