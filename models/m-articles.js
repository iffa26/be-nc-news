const connection = require("../db/connection.js");

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

exports.checkIfUsernameExists = ({ author }) => {
  //console.log("in the selectArticleById model function");
  //console.log(author);
  if (!author) return true; // where author undefined
  return connection("users")
    .where("username", author)
    .then(response => {
      if (response.length === 0) return false;
      return true;
    });
};

exports.checkIfTopicExists = ({ topic }) => {
  //console.log("in the selectArticleById model function");
  if (!topic) return true;
  return connection("topics")
    .where("slug", topic)
    .then(response => {
      if (response.length === 0) return false;
      return true;
    });
};

exports.selectArticleById = ({ article_id }) => {
  //console.log("in the selectArticleById model function");
  return connection("articles")
    .select("articles.*")
    .from("articles")
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
      return response[0];
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
      return response[0];
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
      return newComment[0];
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

exports.selectArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  const valid_sort_by = [
    "article_id",
    "title",
    "votes",
    "topic",
    "created_at",
    "author",
    "comment_count"
  ];
  const valid_order = ["desc", "asc"];

  if (!valid_sort_by.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid column name" });
  }

  if (!valid_order.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order option" });
  }

  return connection("articles")
    .select("articles.*")
    .from("articles") // select all cols from articles
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .modify(function(queryChain) {
      if (author) queryChain.where("articles.author", author);
      if (topic) queryChain.where("articles.topic", topic);
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .then(response => {
      const formattedResponse = [];
      if (response) {
        response.forEach(article => {
          delete article.body;
          formattedResponse.push(article);
        });
      }
      const checkUserExistsPromise = exports.checkIfUsernameExists({
        author
      });
      const checkTopicExistsPromise = exports.checkIfTopicExists({
        topic
      });

      return Promise.all([
        checkUserExistsPromise,
        checkTopicExistsPromise,
        formattedResponse
      ]);
    })
    .then(
      ([
        checkUserExistsPromise,
        checkTopicExistsPromise,
        formattedResponse
      ]) => {
        // console.log(
        //   "final then, user:",
        //   checkUserExistsPromise,
        //   ("topic:", checkTopicExistsPromise)
        // );
        if (checkUserExistsPromise && checkTopicExistsPromise) {
          return formattedResponse;
        } else {
          return Promise.reject({
            status: 404,
            msg: "Not Found: Resource does not exist"
          });
        }
      }
    );
};
