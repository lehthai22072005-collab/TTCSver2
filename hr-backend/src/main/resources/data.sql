-- Insert Employees
INSERT IGNORE INTO employee (id, full_name, department, email, nhom_nhan_su) VALUES
(1, 'Admin Root', 'IT', 'admin@ptit.edu.vn', 'Quản trị'),
(2, 'Nguyễn Văn Giảng Viên', 'CNTT', 'gv@ptit.edu.vn', 'Giảng viên'),
(3, 'Trần Thị Kế Toán', 'Kế toán', 'kt@ptit.edu.vn', 'Nhân viên'),
(4, 'Lê Văn Giám Đốc', 'Ban Giám Hiệu', 'bgh@ptit.edu.vn', 'Lãnh đạo'),
(5, 'Phạm Thị Nhân Sự', 'Nhân sự', 'ns@ptit.edu.vn', 'Nhân viên'),
(6, 'Hoàng Văn Nhân Viên', 'Hành chính', 'nv@ptit.edu.vn', 'Nhân viên'),
(7, 'Đinh Văn Cần Tài Khoản 1', 'Phòng Khảo Thí', 'khao.thi@ptit.edu.vn', 'Nhân viên'),
(8, 'Lý Thị Cần Tài Khoản 2', 'Phòng Đào Tạo', 'dao.tao@ptit.edu.vn', 'Nhân viên');

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

-- Insert Departments
INSERT IGNORE INTO department (id, department_code, name, manager, employee_count, status) VALUES
(1, 'BM01', 'Khoa Công nghệ Thông tin', 'PGS. TS. Trần Văn X', 45, 'Hoạt động'),
(2, 'BM02', 'Khoa Kinh tế', 'TS. Nguyễn Thị Y', 30, 'Hoạt động'),
(3, 'PB01', 'Phòng Hành chính Nhân sự', 'ThS. Lê Văn Z', 12, 'Hoạt động'),
(4, 'PB02', 'Phòng Kế toán', 'CN. Phạm Thị T', 8, 'Hoạt động');

-- Insert Contracts
INSERT IGNORE INTO contract (id, contract_no, employee_id, employee_name, type, role, start_date, end_date, status) VALUES
(1, 'HD-GV-2024/001', 2, 'Nguyễn Văn Giảng Viên', 'Vô thời hạn', 'Giảng viên chính', '2024-01-01', null, 'Đang hiệu lực'),
(2, 'HD-NV-2024/002', 6, 'Hoàng Văn Nhân Viên', 'Xác định thời hạn (12 tháng)', 'Nhân viên hành chính', '2024-06-01', '2025-06-01', 'Đang hiệu lực');


-- Cấu hình gửi mail
INSERT IGNORE INTO system_config (config_key, config_value) VALUES 
('minPasswordLength', '5'),
('maxLoginAttempts', '5'),
('maintenanceMode', 'false'),
('emailEnabled', 'true'),
('smtpUsername', 'gigasmash476996@gmail.com'),
('smtpPassword', 'ttopfnhztmovjfux'),
('senderName', 'PTIT HR Management');
