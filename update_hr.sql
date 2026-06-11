CREATE TABLE IF NOT EXISTS human_resources (
    hr_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

INSERT IGNORE INTO employee (id, full_name, department, position, email, phone, academic_degree, base_salary, contract_start_date, contract_end_date) 
VALUES (5, 'Phạm Nhân Sự', 'Phòng Nhân sự', 'Trưởng phòng', 'nhansu@ptit.edu.vn', '0123123123', 'Thạc sĩ', 18000000, '2026-01-01', '2028-01-01');

INSERT IGNORE INTO human_resources (username, password, employee_id) VALUES ('hr_manager', '123456', 5);
