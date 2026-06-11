const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'hr_management',
  charset: 'utf8mb4'
});

const queries = [
  // Fix nhom_nhan_su in employee
  "UPDATE employee SET nhom_nhan_su = 'Hành chính' WHERE nhom_nhan_su = 'H??nh ch??nh'",
  "UPDATE employee SET nhom_nhan_su = 'Giảng viên' WHERE id = 1",
  
  // Fix teaching_declaration
  "UPDATE teaching_declaration SET hoc_ky = 'Học kỳ 1 - 2026'", // Set all to correct string
  "UPDATE teaching_declaration SET trang_thai = 'ĐÃ DUYỆT' WHERE trang_thai LIKE '%DUY%' OR trang_thai = 'Ä\\x90Ãƒ DUYá»†T'",
  "UPDATE teaching_declaration SET trang_thai = 'TỪ CHỐI' WHERE trang_thai LIKE '%CH%' OR trang_thai = 'Tá»ª CHá»\\x90I'",
  "UPDATE teaching_declaration SET ghi_chu = 'Dạy Cơ sở dữ liệu' WHERE id = 1",
  "UPDATE teaching_declaration SET ghi_chu = 'Bị từ chối' WHERE ghi_chu = 'Bi tu choi'",
  "UPDATE teaching_declaration SET ghi_chu = 'Được duyệt' WHERE ghi_chu = 'Duoc duyet'",
  
  // Fix reward_discipline
  "UPDATE reward_discipline SET reason = 'Làm tốt' WHERE reason = 'Lam tot'",
  "UPDATE reward_discipline SET reason = 'Đi trễ' WHERE reason = 'Di tre'"
];

connection.connect((err) => {
  if (err) throw err;
  
  let current = 0;
  const executeNext = () => {
    if (current >= queries.length) {
      console.log('Fixed all remaining font issues in database!');
      connection.end();
      return;
    }
    const q = queries[current];
    connection.query(q, (error, results) => {
      if (error) {
        console.error('Error on query:', q, error);
      }
      current++;
      executeNext();
    });
  };
  
  executeNext();
});
