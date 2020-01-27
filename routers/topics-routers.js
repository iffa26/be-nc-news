const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/c-topics");
const { send405Error } = require("../errors/errors.js");

topicsRouter
  .route("/")
  .get(sendTopics)
  .all(send405Error);

module.exports = topicsRouter;
