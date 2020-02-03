const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/api-routers.js");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors
} = require("./errors/errors.js");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
