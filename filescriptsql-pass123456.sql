/* 
   Hệ thống Quản lý Nhân sự PTIT - hr_management
   Database Schema & Initial Data
*/

CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

-- ==========================================================
-- 1. DỌN DẸP HỆ THỐNG
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
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- 2. TẠO CÁC BẢNG DỮ LIỆU CỐT LÕI
-- ==========================================================

-- Bảng nhân viên (Cha): Lưu trữ hồ sơ gốc
CREATE TABLE employee (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    position VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    academic_degree VARCHAR(50) DEFAULT 'N/A',
    contract_end_date DATE 
);

-- Khối Giảng viên & Nhân viên
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(50),
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Khối Quản trị (Admin)
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Khối Kế toán
CREATE TABLE accountant (
    acc_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Ban Giám Hiệu
CREATE TABLE ban_giam_hieu (
    bgh_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng Chấm công (Dữ liệu động)
CREATE TABLE cham_cong (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT,
    ngay_cham DATE,
    gio_vao TIME,
    trang_thai VARCHAR(20), -- 'Đúng giờ', 'Trễ', 'Nghỉ'
    so_tiet_day INT DEFAULT 0,
    co_di_lam BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng Lương
CREATE TABLE bang_luong (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT,
    thang_nam VARCHAR(10), 
    luong_co_ban DECIMAL(15,2) DEFAULT 0,
    phu_cap DECIMAL(15,2) DEFAULT 0,
    bhxh_khau_tru DECIMAL(15,2) DEFAULT 0, 
    thue_tncn DECIMAL(15,2) DEFAULT 0,     
    thuc_linh DECIMAL(15,2) DEFAULT 0,
    ngay_cong INT DEFAULT 0,
    tiet_day INT DEFAULT 0,
    trang_thai_chot BOOLEAN DEFAULT FALSE,
    ngay_chot DATETIME,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Nhật ký hệ thống (System Logs)
CREATE TABLE system_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_role VARCHAR(50),
    action VARCHAR(100),
    details TEXT,
    noi_dung TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 3. CHÈN DỮ LIỆU MẪU
-- ==========================================================

-- 1. Hồ sơ nhân sự
INSERT INTO employee (id, full_name, department, position, email, phone, academic_degree, contract_end_date) VALUES 
(1, 'Nguyễn Thị Lan', 'Tổ Toán', 'Giảng viên', 'lan.nguyen@ptit.edu.vn', '0123456789', 'Thạc sĩ', '2026-12-31'),
(2, 'Bác Năm', 'Tổ Bảo vệ', 'Bảo vệ', 'nam.bv@ptit.edu.vn', '0988888777', 'N/A', '2025-06-01'),
(3, 'Lê Tấn Phát', 'Ban Giám Hiệu', 'Hiệu trưởng', 'phat.le@ptit.edu.vn', '0111222333', 'Tiến sĩ', '2030-01-01'),
(4, 'Trần Văn Hải', 'Hành chính', 'Kế toán', 'hai.tran@ptit.edu.vn', '0987654321', 'Cử nhân', '2026-05-15'),
(5, 'Lê Thái Admin', 'Hệ thống', 'Quản trị', 'admin@ptit.edu.vn', '0123999888', 'Kỹ sư', '2029-01-01');

-- 2. Tài khoản người dùng
INSERT INTO staff (username, password, specialization, employee_id) VALUES 
('gv_lan', '123456', 'Toán Cao Cấp', 1),
('bv_nam', '123456', 'An ninh', 2);

INSERT INTO ban_giam_hieu (username, password, employee_id) VALUES 
('Hoang_Nam', '123456789', 3);

INSERT INTO accountant (username, password, employee_id) VALUES 
('Hong_Thai', '094321', 4);

INSERT INTO admin (username, password, employee_id) VALUES 
('Thai_Le_Admin', '123456', 5);

-- 3. Chấm công (Đã sửa định dạng ngày YYYY-MM-DD để tránh lỗi SQL)
INSERT INTO cham_cong (employee_id, ngay_cham, gio_vao, trang_thai, so_tiet_day, co_di_lam) VALUES 
(1, '2026-03-01', '07:55:00', 'Đúng giờ', 4, TRUE),
(1, '2026-03-02', '07:55:00', 'Đúng giờ', 4, TRUE),
(2, '2026-03-02', '06:00:00', 'Đúng giờ', 0, TRUE);

-- 4. Nhật ký hệ thống
INSERT INTO system_logs (user_role, action, details, noi_dung) VALUES 
('ACCOUNTANT', 'LOGIN', 'Kế toán Hồng Thái đăng nhập', '[Hệ thống] Đồng bộ dữ liệu thành công với MySQL.'),
('ACCOUNTANT', 'LOCK_SALARY', 'Chốt lương tháng 03/2026', '[Lương] Tổng quỹ lương tháng này đã được cập nhật tự động.'),
('ACCOUNTANT', 'test', 'test cho vui', 'demo1');



-- Xóa dữ liệu nháp cũ của tháng 03/2026 (nếu có) để tránh trùng lặp
DELETE FROM bang_luong WHERE thang_nam = '03/2026';

-- Chèn dữ liệu lương nháp cho 5 nhân viên theo đúng ID trong database của bạn
INSERT INTO bang_luong (employee_id, thang_nam, luong_co_ban, phu_cap, thuc_linh, trang_thai_chot) VALUES 
(1, '03/2026', 15000000, 1000000, 16000000, 0),
(2, '03/2026', 10000000, 0, 10000000, 0),
(3, '03/2026', 30000000, 5000000, 35000000, 0),
(4, '03/2026', 12000000, 500000, 12500000, 0),
(5, '03/2026', 20000000, 2000000, 22000000, 0);


