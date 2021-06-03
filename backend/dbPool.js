const mysql = require("mysql");

console.log("DBpool called");
const dbPool = mysql.createPool({
  connectionLimit: 75,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});
module.exports = dbPool;
