const apiRouter = require("express").Router();
const topicsRouter = require("./topics-routers.js");
const usersRouter = require("../routers/users-router.js");
const articlesRouter = require("../routers/articles-routers.js");
const commentsRouter = require("../routers/comments-routers.js");
const { send405Error } = require("../errors/errors.js");
const { sendApiEndpoints } = require("../controllers/c-api.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter
  .route("/")
  .get(sendApiEndpoints)
  .all(send405Error);

module.exports = apiRouter;
