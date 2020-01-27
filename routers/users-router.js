const usersRouter = require("express").Router();
const { sendUserByUsername } = require("../controllers/c-users.js");
const { send405Error } = require("../errors/errors.js");

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
