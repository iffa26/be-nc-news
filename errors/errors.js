exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  //console.log(err);
  const errorCodesPSQL = {
    "22P02": [400, "Bad Request: Invalid data type"],
    "23502": [400, "Bad Request: Incomplete body"],
    "23503": [404, "Not Found: Resource does not exist"]
  };
  if (err.code) {
    //console.log(errorCodesPSQL[err.code]);
    res
      .status(errorCodesPSQL[err.code][0])
      .send({ msg: errorCodesPSQL[err.code][1] });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
