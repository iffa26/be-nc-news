const connection = require("../db/connection.js");

exports.selectUserByUsername = ({ username }) => {
  //console.log("in the selectUserByUsername model");
  return connection("users")
    .where("username", username)
    .then(selectUserByUsername_response => {
      if (selectUserByUsername_response.length === 0) {
        return Promise.reject({ status: 404, msg: "Username does not exist" });
      }
      return selectUserByUsername_response[0];
    });
};
