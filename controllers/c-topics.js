const { selectTopics } = require("../models/m-topics.js");

exports.sendTopics = function(req, res, next) {
  //console.log("in the sendTopics controller function");
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(function(err) {
      next(err);
    });
};
