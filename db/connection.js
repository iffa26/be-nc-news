const ENV = process.env.NODE_ENV || "development";

const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", 
      connectionString: process.env.DATABASE_URL, 
      ssl: {
        rejectUnauthorized : false,
      },
    } 
  : {};

const connection = knex(dbConfig);

module.exports = connection;
