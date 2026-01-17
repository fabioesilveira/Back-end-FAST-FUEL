const mysql = require("mysql2/promise");

require("dotenv").config(); // carrega o .env

const connection = mysql.createPool({
  host: "localhost", // Seu host do MySQL
  user: "root", // Seu usuário do MySQL
  password: process.env.DB_PASSWORD, // Sua senha do MySQL
  database: process.env.DB_NAME, // nome do BD 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;