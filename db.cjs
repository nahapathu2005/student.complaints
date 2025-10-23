const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',             // change if needed
  password: 'root', // set your MySQL Workbench password
  database: 'complaint_system'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

module.exports = db;
