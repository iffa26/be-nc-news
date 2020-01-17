const connection = require("../db/connection.js");

exports.sendArticles = () => {};

exports.checkIfArticleExistsById = ({ article_id }) => {
  //console.log("in the selectArticleById model function");
  return connection("articles")
    .where("article_id", article_id)
    .then(response => {
      if (response.length === 0) return false;

      //console.log("checkIfArticleExistsById returns atricle_id: ", article_id);
      return true;
    });
};

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

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Missing request field"
    });
  }

  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
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

exports.insertCommentToArticle = ({ article_id }, { username, body }) => {
  //console.log("inside the insertCommentToArticle model function");
  //console.log(article_id, username, body);
  // req.params: { article_id: '4' }
  // req.body: { username: 'iffa26', body: 'this is so fun' }

  if (body === "" || username === "") {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Incomplete request"
    });
  }
  return connection("comments")
    .insert({
      article_id: article_id,
      body: body,
      author: username
    })
    .returning("*")
    .then(newComment => {
      //console.log(newComment);
      return newComment;
    });
};

exports.selectCommentsByArticleId = (
  { article_id },
  { sort_by = "created_at", order = "desc" }
) => {
  const valid_sort_by = ["comment_id", "votes", "created_at", "author", "body"];
  const valid_order = ["desc", "asc"];

  if (!valid_sort_by.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid column name" });
  }

  if (!valid_order.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order option" });
  }

  // console.log(
  //   "in the selectCommentsOnArticle model function, article_id:",
  //   article_id,
  //   sort_by,
  //   order
  // );
  return connection("comments")
    .where("article_id", article_id)
    .orderBy(sort_by, order)
    .then(comments => {
      const formattedComments = [];

      if (comments) {
        comments.forEach(comment => {
          delete comment.article_id;
          formattedComments.push(comment);
        });
        //console.log("comments in model", formattedComments);
      }
      const checkArticleIdPromise = exports.checkIfArticleExistsById({
        article_id
      });

      return Promise.all([checkArticleIdPromise, formattedComments]);
    })
    .then(([checkArticleId, formattedComments]) => {
      //console.log("model***", checkArticleId, formattedComments);
      if (checkArticleId) {
        return formattedComments;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Not Found: article_id does not exist"
        });
      }
    });
};
