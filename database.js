require("dotenv").config();
const mysql = require("mysql2");
module.exports = mysql.createConnection({
  host: process.env.HOST ||  "localhost",
  user: process.env.USERNAME||"ishan",
  password: process.env.PASSWORD,
  database: "library",
  port: process.env.PORT || 3306,
});
