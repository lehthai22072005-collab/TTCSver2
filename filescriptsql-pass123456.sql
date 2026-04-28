CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

-- ==========================================================
-- 1. DỌN DẸP HỆ THỐNG (Tắt kiểm tra khóa ngoại để xóa sạch không lỗi)
-- ==========================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS system_logs;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS bang_luong;
DROP TABLE IF EXISTS cham_cong;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS accountant;
DROP TABLE IF EXISTS ban_giam_hieu;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS teacher; -- Xóa bảng cũ nếu còn tồn tại
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- 2. TẠO CÁC BẢNG DỮ LIỆU CỐT LÕI
-- ==========================================================

-- Bảng nhân viên (Cha): Hồ sơ gốc cho TẤT CẢ mọi người
CREATE TABLE employee (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    position VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    academic_degree VARCHAR(50) DEFAULT 'N/A', -- Bằng cấp
    contract_end_date DATE 
);

-- Bảng tài khoản dành cho Khối Giảng viên & Nhân viên (Bảo vệ, Lao công...)
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(50), -- Chuyên môn/Môn học
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng tài khoản Admin
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng tài khoản Kế toán
CREATE TABLE accountant (
    acc_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng tài khoản Ban Giám Hiệu (Bổ sung dữ liệu mẫu bên dưới)
CREATE TABLE ban_giam_hieu (
    bgh_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng Chấm công
CREATE TABLE cham_cong (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT,
    ngay_cham DATE,
    gio_vao TIME,
    trang_thai VARCHAR(20), -- 'Đúng giờ', 'Trễ', 'Nghỉ'
    so_tiet_day INT DEFAULT 0,
    co_di_lam BOOLEAN DEFAULT TRUE, -- Tính ngày công cho nhân viên hành chính
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng Lương (Chi tiết theo UC-014)
CREATE TABLE bang_luong (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT,
    thang_nam VARCHAR(10), 
    luong_co_ban DECIMAL(15,2) DEFAULT 0,
    phu_cap DECIMAL(15,2) DEFAULT 0,
    bhxh_khau_tru DECIMAL(15,2) DEFAULT 0, 
    thue_tncn DECIMAL(15,2) DEFAULT 0,     
    thuc_linh DECIMAL(15,2) DEFAULT 0,
    trang_thai_chot BOOLEAN DEFAULT FALSE,
    ngay_chot DATETIME,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- ==========================================================
-- 3. CHÈN DỮ LIỆU MẪU (ĐẦY ĐỦ 4 NHÓM QUYỀN)
-- ==========================================================

-- 1. Thêm hồ sơ nhân sự
INSERT INTO employee (id, full_name, department, position, email, phone, academic_degree, contract_end_date) VALUES 
(1, 'Nguyễn Thị Lan', 'Tổ Toán', 'Giảng viên', 'lan.nguyen@ptit.edu.vn', '0123456789', 'Thạc sĩ', '2026-12-31'),
(2, 'Bác Năm', 'Tổ Bảo vệ', 'Bảo vệ', 'nam.bv@ptit.edu.vn', '0988888777', 'N/A', '2025-06-01'),
(3, 'Lê Tấn Phát', 'Ban Giám Hiệu', 'Hiệu trưởng', 'phat.le@ptit.edu.vn', '0111222333', 'Tiến sĩ', '2030-01-01'),
(4, 'Trần Văn Hải', 'Hành chính', 'Kế toán', 'hai.tran@ptit.edu.vn', '0987654321', 'Cử nhân', '2026-05-15'),
(5, 'Lê Thái Admin', 'Hệ thống', 'Quản trị', 'admin@ptit.edu.vn', '0123999888', 'Kỹ sư', '2029-01-01');

-- 2. Cấp tài khoản Đăng nhập

-- Tài khoản cho Giảng viên & Nhân viên (staff)
INSERT INTO staff (username, password, specialization, employee_id) VALUES 
('gv_lan', '123456', 'Toán Cao Cấp', 1),
('bv_nam', '123456', 'An ninh', 2);

-- Tài khoản cho Ban Giám Hiệu (QUAN TRỌNG)
INSERT INTO ban_giam_hieu (username, password, employee_id) VALUES 
('Hoang_Nam', '123456789', 3);

-- Tài khoản cho Kế toán
INSERT INTO accountant (username, password, employee_id) VALUES 
('Hong_Thai', '094321', 4);

-- Tài khoản cho Admin
INSERT INTO admin (username, password, employee_id) VALUES 
('Thai_Le_Admin', '123456', 5);

-- 3. Chèn mẫu chấm công để tính lương
INSERT INTO cham_cong (employee_id, ngay_cham, gio_vao, trang_thai, so_tiet_day, co_di_lam) VALUES 
(1, '2026-03-02', '07:55:00', 'Đúng giờ', 4, TRUE), -- GV Lan
(2, '2026-03-02', '06:00:00', 'Đúng giờ', 0, TRUE); -- Bác Năm