const {
  ammendVotesOnComment,
  deleteCommentById
} = require("../models/m-comments.js");

exports.updateCommentVotes = (req, res, next) => {
  // console.log("inside the updateCommentVotes controller");
  // req.params { comment_id: '14' }
  // req.body { inc_votes: 1 }

  ammendVotesOnComment(req.params, req.body)
    .then(comment => {
      if (req.body.inc_votes) {
        res.status(200).send({ comment });
      } else {
        res.status(200).send({ comment });
      }
    })
    .catch(function(err) {
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  deleteCommentById(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(function(err) {
      next(err);
    });
};
