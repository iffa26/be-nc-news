testData = require("../data/test-data/index.js");
devData = require("../data/development-data/index");

const env = process.env.NODE_ENV || "development";
const allData = {
  test: testData,
  development: devData,
  production: devData
};

module.exports = allData[env];
