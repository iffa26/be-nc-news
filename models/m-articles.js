const connection = require("../db/connection.js");

exports.sendArticles = () => {};

exports.selectArticleById = ({ article_id }) => {
  //console.log("in the selectArticleById model function");
  return connection("articles")
    .select("articles.*")
    .from("articles") // select all cols from articles
    .where("articles.article_id", article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(response => {
      if (response.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found: article_id does not exist"
        });
      }
      return response;
    });
};

exports.ammendArticleById = ({ article_id }, { inc_votes }) => {
  //console.log("in the ammendArticleById function", inc_votes, article_id);
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(response => {
      return response;
    });
};
