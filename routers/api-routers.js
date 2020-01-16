const apiRouter = require("express").Router();

const {
  sendArticles,
  sendArticleById,
  sendUpdatedArticle,
  sendCommentOnArticle
} = require("../controllers/c-articles.js");
const {} = require("../controllers/c-comments.js");
const { sendTopics } = require("../controllers/c-topics.js");
const { sendUserByUsername } = require("../controllers/c-users.js");

apiRouter.route("/topics").get(sendTopics);

apiRouter.route("/users/:username").get(sendUserByUsername);

//apiRouter.route("/articles").get(sendArticles);

apiRouter
  .route("/articles/:article_id")
  .get(sendArticleById)
  .patch(sendUpdatedArticle);

apiRouter.route("/articles/:article_id/comments").post(sendCommentOnArticle);

module.exports = apiRouter;
