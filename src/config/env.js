const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
  host: process.env.HOST || "localhost",
  db: {
    host: "mariadb-34248-0.cloudclusters.net",
    user: "root",
    password: "SDAT@3480",
    database: "lottery_dev",
    port: 34248,
  },
};

module.exports = config;
