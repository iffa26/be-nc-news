const { selectUserByUsername } = require("../models/m-users.js");

exports.sendUserByUsername = (req, res, next) => {
  //console.log("in sendUserByUsername controller");
  selectUserByUsername(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(function(err) {
      next(err);
    });
};
