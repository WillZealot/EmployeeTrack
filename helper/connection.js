const mysql = require('mysql2');

const db = mysql.createConnection(						//creating the connection here
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: 'Arzamas16$2023',
    database: 'company_db'
  }
);

module.exports = db;