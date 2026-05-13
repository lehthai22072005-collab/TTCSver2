/* 
   Hệ thống Quản lý Nhân sự PTIT - hr_management
   Full Standardized Schema & Initial Data (Updated: 2026-05-13)
*/

CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

-- ==========================================================
-- 1. DỌN DẸP HỆ THỐNG (RESET)
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

-- Bảng nhân viên: Lưu hồ sơ và mức Lương cơ bản gốc
CREATE TABLE employee (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    position VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    academic_degree VARCHAR(50) DEFAULT 'N/A',
    contract_end_date DATE,
    base_salary DECIMAL(15,2) DEFAULT 10000000 -- Cột quan trọng để tính lương động
);

-- Các bảng phân quyền tài khoản
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(50),
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

CREATE TABLE accountant (
    acc_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

CREATE TABLE ban_giam_hieu (
    bgh_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Bảng Chấm công: Nguồn dữ liệu để đếm công và tiết dạy
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

-- Bảng Lương: Lưu kết quả sau khi nhấn nút "Tính lương"
CREATE TABLE bang_luong (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT,
    thang_nam VARCHAR(10), -- MM/YYYY
    luong_co_ban DECIMAL(15,2) DEFAULT 0,
    phu_cap DECIMAL(15,2) DEFAULT 0,
    bhxh_khau_tru DECIMAL(15,2) DEFAULT 0, 
    thue_tncn DECIMAL(15,2) DEFAULT 0,     
    thuc_linh DECIMAL(15,2) DEFAULT 0,
    ngay_cong INT DEFAULT 0,
    tiet_day INT DEFAULT 0,
    trang_thai_chot BOOLEAN DEFAULT FALSE,
    ngay_chot DATETIME,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    -- Ràng buộc UNIQUE để tránh tạo lương 2 lần cho 1 người trong 1 tháng
    CONSTRAINT unique_salary_period UNIQUE (employee_id, thang_nam)
);

CREATE TABLE system_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_role VARCHAR(50),
    action VARCHAR(100),
    details TEXT,
    noi_dung TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 3. CHÈN DỮ LIỆU MẪU (TEST DATA)
-- ==========================================================

-- 1. Chèn danh sách nhân viên với mức lương gốc thực tế
INSERT INTO employee (id, full_name, department, position, email, phone, academic_degree, contract_end_date, base_salary) VALUES 
(1, 'Nguyễn Thị Lan', 'Tổ Toán', 'Giảng viên', 'lan.nguyen@ptit.edu.vn', '0123456789', 'Thạc sĩ', '2026-12-31', 15000000),
(2, 'Bác Năm', 'Tổ Bảo vệ', 'Bảo vệ', 'nam.bv@ptit.edu.vn', '0988888777', 'N/A', '2025-06-01', 10000000),
(3, 'Lê Tấn Phát', 'Ban Giám Hiệu', 'Hiệu trưởng', 'phat.le@ptit.edu.vn', '0111222333', 'Tiến sĩ', '2030-01-01', 30000000),
(4, 'Trần Văn Hải', 'Hành chính', 'Kế toán', 'hai.tran@ptit.edu.vn', '0987654321', 'Cử nhân', '2026-05-15', 12000000),
(5, 'Lê Thái Admin', 'Hệ thống', 'Quản trị', 'admin@ptit.edu.vn', '0123999888', 'Kỹ sư', '2029-01-01', 20000000);

-- 2. Tài khoản người dùng (Password mặc định: 123456)
INSERT INTO staff (username, password, specialization, employee_id) VALUES ('gv_lan', '123456', 'Toán Cao Cấp', 1), ('bv_nam', '123456', 'An ninh', 2);
INSERT INTO ban_giam_hieu (username, password, employee_id) VALUES ('Tan_Phat', '123456', 3);
INSERT INTO accountant (username, password, employee_id) VALUES ('Van_Hai', '123456', 4);
INSERT INTO admin (username, password, employee_id) VALUES ('Thai_Le_Admin', '123456', 5);

-- 3. Chèn Chấm công mẫu cho tháng 03/2026 để bạn test tính lương tự động
-- (Xóa bỏ phần INSERT bang_luong để ép hệ thống tự tính dựa trên đống này)
INSERT INTO cham_cong (employee_id, ngay_cham, gio_vao, trang_thai, so_tiet_day, co_di_lam) VALUES 
(1, '2026-03-01', '07:55:00', 'Đúng giờ', 4, TRUE),
(1, '2026-03-02', '07:55:00', 'Đúng giờ', 4, TRUE),
(1, '2026-03-03', '07:55:00', 'Đúng giờ', 4, TRUE),
(2, '2026-03-02', '06:00:00', 'Đúng giờ', 0, TRUE),
(3, '2026-03-02', '08:00:00', 'Đúng giờ', 0, TRUE),
(4, '2026-03-02', '08:00:00', 'Đúng giờ', 0, TRUE),
(5, '2026-03-02', '08:00:00', 'Đúng giờ', 0, TRUE);

-- 4. Nhật ký hệ thống
INSERT INTO system_logs (user_role, action, details, noi_dung) VALUES 
('ADMIN', 'SETUP', 'Khởi tạo DB hoàn chỉnh', 'Đã chuyển sang chế độ tính lương tự động dựa trên chấm công.');