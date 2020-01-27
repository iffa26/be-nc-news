const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendArticleById,
  sendUpdatedArticle,
  updateCommentOnArticle,
  sendCommentsByArticleId
} = require("../controllers/c-articles.js");
const { send405Error } = require("../errors/errors.js");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(sendUpdatedArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(updateCommentOnArticle)
  .get(sendCommentsByArticleId)
  .all(send405Error);

articlesRouter
  .route("/")
  .get(sendArticles)
  .all(send405Error);

module.exports = articlesRouter;
