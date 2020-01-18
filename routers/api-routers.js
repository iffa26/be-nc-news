const apiRouter = require("express").Router();
const { send405Error } = require("../errors/errors.js");

const {
  sendArticles,
  sendArticleById,
  sendUpdatedArticle,
  updateCommentOnArticle,
  sendCommentsByArticleId
} = require("../controllers/c-articles.js");
const {
  updateCommentVotes,
  removeCommentById
} = require("../controllers/c-comments.js");
const { sendTopics } = require("../controllers/c-topics.js");
const { sendUserByUsername } = require("../controllers/c-users.js");

apiRouter
  .route("/topics")
  .get(sendTopics)
  .all(send405Error);

apiRouter
  .route("/users/:username")
  .get(sendUserByUsername)
  .all(send405Error);

apiRouter
  .route("/articles/:article_id")
  .get(sendArticleById)
  .patch(sendUpdatedArticle)
  .all(send405Error);

apiRouter
  .route("/articles/:article_id/comments")
  .post(updateCommentOnArticle)
  .get(sendCommentsByArticleId)
  .all(send405Error);

apiRouter
  .route("/articles")
  .get(sendArticles)
  .all(send405Error);

apiRouter
  .route("/comments/:comment_id")
  .patch(updateCommentVotes)
  .delete(removeCommentById)
  .all(send405Error);

module.exports = apiRouter;
