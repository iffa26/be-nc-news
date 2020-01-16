const {
  sendArticles,
  selectArticleById,
  ammendArticleById,
  insertCommentToArticle,
  selectCommentsByArticleId
} = require("../models/m-articles.js");

exports.sendArticles = (req, res, next) => {
  console.log("inside the sendArticles controller");
};

exports.sendArticleById = (req, res, next) => {
  //console.log("in the sendArticleById controller function");
  //console.log("req.params", req.params);

  selectArticleById(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(function(err) {
      next(err);
    });
};

exports.sendUpdatedArticle = (req, res, next) => {
  //console.log("in sendUpdatedArticle controller function");
  //console.log("req.params:", req.params, "req.body:", req.body);

  ammendArticleById(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(function(err) {
      next(err);
    });
};

exports.updateCommentOnArticle = (req, res, next) => {
  //console.log("in the sendCommentOnArticle controller function");
  //console.log("req.params:", req.params, "req.body:", req.body);

  // req.params: { article_id: '4' }
  // req.body: { username: 'iffa26', body: 'this is so fun' }

  insertCommentToArticle(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(function(err) {
      next(err);
    });
};

exports.sendCommentsByArticleId = (req, res, next) => {
  //console.log("in the sendCommentsOnArticle controller");
  console.log("req.params:", req.params, "req.query:", req.query);

  // req.params: { article_id: '5' }
  // req.body: {}
  // req.query: {sort_by: "votes", order: "asc"}

  selectCommentsByArticleId(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(function(err) {
      next(err);
    });
};
