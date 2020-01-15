const express = require("express");
const apiRouter = require("./routers/api-routers.js");

const app = express();

app.use(express.json()); // what does this line do??

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  //console.log(err);
  const errorCodesPSQL = { "22P02": [400, "Bad Request: Invalid article_id"] };
  if (err.code) {
    //console.log(errorCodesPSQL[err.code]);
    res
      .status(errorCodesPSQL[err.code][0])
      .send({ msg: errorCodesPSQL[err.code][1] });
  } else {
    // custom errors
    // console.log(err);
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
