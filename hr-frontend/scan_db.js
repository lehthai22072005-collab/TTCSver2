const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'hr_management',
  charset: 'utf8mb4'
});

const queries = [
  'SELECT id, nhom_nhan_su FROM employee',
  'SELECT id, trang_thai FROM cham_cong LIMIT 10',
  'SELECT id, reason, status FROM leave_requests LIMIT 10',
  'SELECT id, hoc_ky, ghi_chu, trang_thai FROM teaching_declaration',
  'SELECT id, reason, type FROM reward_discipline LIMIT 10',
  'SELECT id, hanh_dong FROM system_logs LIMIT 10'
];

connection.connect((err) => {
  if (err) throw err;
  
  let current = 0;
  const executeNext = () => {
    if (current >= queries.length) {
      connection.end();
      return;
    }
    const q = queries[current];
    connection.query(q, (error, results) => {
      if (!error && results.length > 0) {
         console.log(`\n--- Results for: ${q} ---`);
         console.log(results);
      }
      current++;
      executeNext();
    });
  };
  
  executeNext();
});
