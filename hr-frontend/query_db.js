const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'hr_management',
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) throw err;
  connection.query('SELECT id, full_name, department, position, academic_degree FROM employee', (error, results) => {
    if (error) throw error;
    console.log(results);
    connection.end();
  });
});
