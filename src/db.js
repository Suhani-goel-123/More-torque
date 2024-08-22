const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Suhani_G', // replace with your MySQL username
  password: 'Suhani2005', // replace with your MySQL password
  database: 'moret',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;
