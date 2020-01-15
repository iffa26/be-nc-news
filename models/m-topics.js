const connection = require("../db/connection.js");

exports.selectTopics = function() {
  //console.log("in the selectTopics model function");
  return connection("topics").then(selectTopicsResponse => {
    return selectTopicsResponse;
  });
};
