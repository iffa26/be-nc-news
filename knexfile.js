const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news"
      // user,
      // password
    }
  },
  production: {
    connection: {

      connectionString: DB_URL, 
      ssl: {
            rejectUnauthorized: false,
          },
        }
  },
  test: {
    connection: {
      database: "nc_news_test"
      // user,
      // password
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
