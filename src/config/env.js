const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  host: process.env.HOST || "localhost",
  db: {
    host: "mariadb-34248-0.cloudclusters.net",
    user: "root",
    password: "SDAT@3480",
    database: "lottery_test",
    port: 34248,
  },
};

module.exports = config;