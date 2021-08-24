const mysql = require("mysql");
const env=require('../config');
const db=mysql.createConnection({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  port: env.db.port,
});
module.exports = db;
