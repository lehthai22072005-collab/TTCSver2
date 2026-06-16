-- Insert Departments first so employee.department_id can reference real rows.
INSERT IGNORE INTO department (id, department_code, name, manager, employee_count, status) VALUES
(1, 'IT', 'IT', 'Admin Root', 1, 'Hoat dong'),
(2, 'CNTT', 'Khoa CNTT', 'Nguyen Van Giang Vien', 1, 'Hoat dong'),
(3, 'KT', 'Ke toan', 'Tran Thi Ke Toan', 1, 'Hoat dong'),
(4, 'BGH', 'Ban Giam Hieu', 'Le Van Giam Doc', 1, 'Hoat dong'),
(5, 'NS', 'Nhan su', 'Pham Thi Nhan Su', 1, 'Hoat dong'),
(6, 'HC', 'Hanh chinh', 'Hoang Van Nhan Vien', 1, 'Hoat dong'),
(7, 'PKT', 'Phong Khao Thi', 'Dinh Van Can Tai Khoan 1', 1, 'Hoat dong'),
(8, 'PDT', 'Phong Dao Tao', 'Ly Thi Can Tai Khoan 2', 1, 'Hoat dong'),
(9, 'BM01', 'Khoa Cong nghe Thong tin', 'PGS. TS. Tran Van X', 45, 'Hoat dong'),
(10, 'BM02', 'Khoa Kinh te', 'TS. Nguyen Thi Y', 30, 'Hoat dong'),
(11, 'PB01', 'Phong Hanh chinh Nhan su', 'ThS. Le Van Z', 12, 'Hoat dong'),
(12, 'PB02', 'Phong Ke toan', 'CN. Pham Thi T', 8, 'Hoat dong'),
(13, 'NONE', 'Khong thuoc khoa', 'Chua phan cong', 0, 'Hoat dong');

UPDATE department SET department_code = 'IT', name = 'IT', manager = 'Admin Root', employee_count = 1, status = 'Hoat dong' WHERE id = 1;
UPDATE department SET department_code = 'CNTT', name = 'Khoa CNTT', manager = 'Nguyen Van Giang Vien', employee_count = 1, status = 'Hoat dong' WHERE id = 2;
UPDATE department SET department_code = 'KT', name = 'Ke toan', manager = 'Tran Thi Ke Toan', employee_count = 1, status = 'Hoat dong' WHERE id = 3;
UPDATE department SET department_code = 'BGH', name = 'Ban Giam Hieu', manager = 'Le Van Giam Doc', employee_count = 1, status = 'Hoat dong' WHERE id = 4;
UPDATE department SET department_code = 'NS', name = 'Nhan su', manager = 'Pham Thi Nhan Su', employee_count = 1, status = 'Hoat dong' WHERE id = 5;
UPDATE department SET department_code = 'HC', name = 'Hanh chinh', manager = 'Hoang Van Nhan Vien', employee_count = 1, status = 'Hoat dong' WHERE id = 6;
UPDATE department SET department_code = 'PKT', name = 'Phong Khao Thi', manager = 'Dinh Van Can Tai Khoan 1', employee_count = 1, status = 'Hoat dong' WHERE id = 7;
UPDATE department SET department_code = 'PDT', name = 'Phong Dao Tao', manager = 'Ly Thi Can Tai Khoan 2', employee_count = 1, status = 'Hoat dong' WHERE id = 8;

-- Insert Employees
INSERT IGNORE INTO employee (id, full_name, department, department_id, email, nhom_nhan_su) VALUES
(1, 'Admin Root', 'IT', 1, 'admin@ptit.edu.vn', 'Quan tri'),
(2, 'Nguyen Van Giang Vien', 'Khoa CNTT', 2, 'gv@ptit.edu.vn', 'Giang vien'),
(3, 'Tran Thi Ke Toan', 'Ke toan', 3, 'kt@ptit.edu.vn', 'Nhan vien'),
(4, 'Le Van Giam Doc', 'Ban Giam Hieu', 4, 'bgh@ptit.edu.vn', 'Lanh dao'),
(5, 'Pham Thi Nhan Su', 'Nhan su', 5, 'ns@ptit.edu.vn', 'Nhan vien'),
(6, 'Hoang Van Nhan Vien', 'Hanh chinh', 6, 'nv@ptit.edu.vn', 'Nhan vien'),
(7, 'Dinh Van Can Tai Khoan 1', 'Phong Khao Thi', 7, 'khao.thi@ptit.edu.vn', 'Nhan vien'),
(8, 'Ly Thi Can Tai Khoan 2', 'Phong Dao Tao', 8, 'dao.tao@ptit.edu.vn', 'Nhan vien');

-- Backfill department_id for databases that already had employees before this relation was added.
UPDATE employee e
JOIN department d ON LOWER(TRIM(d.name)) = LOWER(TRIM(e.department))
SET e.department_id = d.id
WHERE e.department_id IS NULL;

UPDATE employee SET department_id = 1 WHERE department_id IS NULL AND (email = 'admin@ptit.edu.vn' OR department LIKE '%IT%');
UPDATE employee SET department_id = 2 WHERE department_id IS NULL AND (email = 'gv@ptit.edu.vn' OR department LIKE '%CNTT%');
UPDATE employee SET department_id = 3 WHERE department_id IS NULL AND (email = 'kt@ptit.edu.vn' OR department LIKE '%toan%' OR department LIKE '%toán%');
UPDATE employee SET department_id = 4 WHERE department_id IS NULL AND (email = 'bgh@ptit.edu.vn' OR department LIKE '%Giam%' OR department LIKE '%Giám%' OR department LIKE '%Hieu%' OR department LIKE '%Hiệu%');
UPDATE employee SET department_id = 5 WHERE department_id IS NULL AND (email = 'ns@ptit.edu.vn' OR department LIKE '%Nhan su%' OR department LIKE '%Nhân s%');
UPDATE employee SET department_id = 6 WHERE department_id IS NULL AND (email = 'nv@ptit.edu.vn' OR department LIKE '%Hanh%' OR department LIKE '%Hành%');
UPDATE employee SET department_id = 7 WHERE department_id IS NULL AND (email = 'khao.thi@ptit.edu.vn' OR department LIKE '%Khao%' OR department LIKE '%Khảo%');
UPDATE employee SET department_id = 8 WHERE department_id IS NULL AND (email = 'dao.tao@ptit.edu.vn' OR department LIKE '%Dao%' OR department LIKE '%Đào%');
UPDATE employee SET department_id = 12 WHERE department_id IS NULL AND department LIKE '%Ke toan%';
UPDATE employee SET department_id = 13 WHERE department_id IS NULL AND (department IS NULL OR department = '' OR department LIKE '%Không thuộc khoa%' OR department LIKE '%Khong thuoc khoa%');

-- Insert Accounts
-- admin
INSERT IGNORE INTO admin (admin_id, username, password, status, employee_id) VALUES
(1, 'admin', 'admin123', 'Active', 1);

-- staff (Teacher & Regular Staff)
INSERT IGNORE INTO staff (staff_id, username, password, status, employee_id) VALUES
(1, 'teacher', '123456', 'Active', 2),
(2, 'staff', '123456', 'Active', 6);

-- accountant
INSERT IGNORE INTO accountant (acc_id, username, password, status, employee_id) VALUES
(1, 'accountant', '123456', 'Active', 3);

-- ban_giam_hieu
INSERT IGNORE INTO ban_giam_hieu (bgh_id, username, password, status, employee_id) VALUES
(1, 'director', '123456', 'Active', 4);

-- human_resources
INSERT IGNORE INTO human_resources (hr_id, username, password, status, employee_id) VALUES
(1, 'hr', '123456', 'Active', 5);

-- Insert Contracts
INSERT IGNORE INTO contract (id, contract_no, employee_id, employee_name, type, role, start_date, end_date, status) VALUES
(1, 'HD-GV-2024/001', 2, 'Nguyen Van Giang Vien', 'Vo thoi han', 'Giang vien chinh', '2024-01-01', null, 'Dang hieu luc'),
(2, 'HD-NV-2024/002', 6, 'Hoang Van Nhan Vien', 'Xac dinh thoi han (12 thang)', 'Nhan vien hanh chinh', '2024-06-01', '2025-06-01', 'Dang hieu luc');

-- Cau hinh gui mail
INSERT IGNORE INTO system_config (config_key, config_value) VALUES
('minPasswordLength', '5'),
('maxLoginAttempts', '5'),
('maintenanceMode', 'false'),
('emailEnabled', 'true'),
('smtpUsername', 'gigasmash476996@gmail.com'),
('smtpPassword', 'ttopfnhztmovjfux'),
('senderName', 'PTIT HR Management');
