const mysql = require("mysql");
const env=require('../config');
// const con = require("../../package.json");

const db=mysql.createConnection({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  port: env.db.port,
});
// const db = mysql.createConnection({
//   host: con.dbConf.host,
//   user: con.dbConf.user,
//   password: con.dbConf.password,
//   database: con.dbConf.database,
//   port: con.dbConf.port,
// });
module.exports = db;
