const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'hr_management',
  charset: 'utf8mb4'
});

const updates = [
  { id: 1, department: 'Khoa Cơ bản', position: 'Giảng viên', academic_degree: 'Thạc sĩ' },
  { id: 2, department: 'Ban Giám Hiệu', position: 'Hiệu trưởng', academic_degree: 'Tiến sĩ' },
  { id: 3, department: 'Phòng Tài chính', position: 'Kế toán', academic_degree: 'Cử nhân' },
  { id: 4, department: 'Trung tâm IT', position: 'Quản trị viên', academic_degree: 'Kỹ sư' },
  { id: 5, department: 'Phòng Nhân sự', position: 'Trưởng phòng', academic_degree: 'Thạc sĩ' },
];

connection.connect((err) => {
  if (err) throw err;
  
  let completed = 0;
  updates.forEach(emp => {
    connection.query(
      'UPDATE employee SET department = ?, position = ?, academic_degree = ? WHERE id = ?',
      [emp.department, emp.position, emp.academic_degree, emp.id],
      (error) => {
        if (error) throw error;
        completed++;
        if (completed === updates.length) {
          console.log('Fixed additional fields!');
          connection.end();
        }
      }
    );
  });
});
