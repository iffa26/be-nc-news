testData = require("../data/test-data/index.js");
devData = require("../data/development-data/index");

const env = process.env.NODE_MODULES || "dev";

allData = {
  test: testData,
  dev: devData
};

module.exports = allData[env];
