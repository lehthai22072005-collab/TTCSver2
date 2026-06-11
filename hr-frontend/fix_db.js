const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'hr_management',
  charset: 'utf8mb4'
});

const employees = [
  { id: 1, name: 'Nguyễn Thị Lan' },
  { id: 2, name: 'Lê Tấn Phát' },
  { id: 3, name: 'Trần Văn Hải' },
  { id: 4, name: 'Lê Thái Admin' },
  { id: 5, name: 'Phạm Nhân Sự' },
  { id: 6, name: 'hoang' },
  { id: 7, name: 'Hoang' }
];

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
  
  let completed = 0;
  employees.forEach(emp => {
    connection.query(
      'UPDATE employee SET full_name = ? WHERE id = ?',
      [emp.name, emp.id],
      (error, results, fields) => {
        if (error) throw error;
        console.log(`Updated employee ${emp.id} to ${emp.name}`);
        completed++;
        if (completed === employees.length) {
          connection.end();
        }
      }
    );
  });
});
