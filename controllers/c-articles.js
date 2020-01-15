const {
  sendArticles,
  selectArticleById,
  ammendArticleById
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
