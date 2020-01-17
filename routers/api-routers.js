const apiRouter = require("express").Router();
const { send405Error } = require("../errors/errors.js");

const {
  sendArticles,
  sendArticleById,
  sendUpdatedArticle,
  updateCommentOnArticle,
  sendCommentsByArticleId
} = require("../controllers/c-articles.js");
const {} = require("../controllers/c-comments.js");
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

// wildcard route??

module.exports = apiRouter;

// to do:
// user doesnt exist - test should fail
// when response contsins a single object return a single object
// when response is a list of objects return an array
// 405 error handling with .all() in router
