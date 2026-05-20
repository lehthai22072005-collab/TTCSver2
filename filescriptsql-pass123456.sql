/* Hệ thống Quản lý Nhân sự PTIT - hr_management
   Bản chuẩn hóa Clean Database (4 Roles: Admin, Accountant, Director, Teacher)
*/

CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

-- ==========================================================
-- 1. DỌN DẸP HỆ THỐNG (RESET TỪ CON SỐ 0)
-- ==========================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS system_logs;
DROP TABLE IF EXISTS monthly_budget;
DROP TABLE IF EXISTS system_config;
DROP TABLE IF EXISTS bang_luong;
DROP TABLE IF EXISTS cham_cong;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS accountant;
DROP TABLE IF EXISTS ban_giam_hieu;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS employee;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- 2. TẠO CÁC BẢNG DỮ LIỆU
-- ==========================================================

-- Bảng Nhân viên (Gốc)
CREATE TABLE employee (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    position VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    academic_degree VARCHAR(50) DEFAULT 'N/A',
    contract_end_date DATE,
    base_salary DECIMAL(15,2) DEFAULT 10000000 
);

-- Khối Giảng viên/Nhân viên (Dùng bảng staff để lưu)
CREATE TABLE staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Khối Quản trị (Admin)
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Khối Kế toán
CREATE TABLE accountant (
    acc_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Khối Ban Giám Hiệu
CREATE TABLE ban_giam_hieu (
    bgh_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- ==========================================================
-- BẢNG PHỤ TRỢ (Để code Spring Boot không báo lỗi thiếu bảng)
-- ==========================================================
CREATE TABLE cham_cong (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT,
    ngay_cham DATE,
    gio_vao TIME,
    trang_thai VARCHAR(20), 
    so_tiet_day INT DEFAULT 0,
    co_di_lam BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

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
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT unique_salary_period UNIQUE (employee_id, thang_nam)
);

CREATE TABLE leave_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT,
    employee_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    reason VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE monthly_budget (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    thang_nam VARCHAR(10) UNIQUE,
    phu_cap_du_tinh DECIMAL(15,2) DEFAULT 0
);

-- ĐÃ FIX: Chuẩn hóa các cột để khớp với logic tự động ghi Log ở Backend
CREATE TABLE system_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    thoi_gian VARCHAR(50), 
    hanh_dong VARCHAR(255),
    nguoi_dung VARCHAR(100)
);

CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(50) UNIQUE NOT NULL,
    config_value VARCHAR(255),
    description VARCHAR(255)
);

-- ==========================================================
-- 3. CHÈN TÀI KHOẢN MẪU VÀ CẬP NHẬT DỮ LIỆU
-- ==========================================================

-- 1. Chèn Hồ sơ 4 nhân viên gốc
INSERT INTO employee (id, full_name, department, position, email, phone, academic_degree, base_salary) VALUES 
(1, 'Nguyễn Thị Lan', 'Khoa Cơ bản', 'Giảng viên', 'lan.nguyen@ptit.edu.vn', '0123456789', 'Thạc sĩ', 15000000),
(2, 'Lê Tấn Phát', 'Ban Giám Hiệu', 'Hiệu trưởng', 'phat.le@ptit.edu.vn', '0111222333', 'Tiến sĩ', 30000000),
(3, 'Trần Văn Hải', 'Phòng Tài chính', 'Kế toán', 'hai.tran@ptit.edu.vn', '0987654321', 'Cử nhân', 12000000),
(4, 'Lê Thái Admin', 'Trung tâm IT', 'Quản trị viên', 'admin@ptit.edu.vn', '0123999888', 'Kỹ sư', 20000000);

-- 2. Cấp tài khoản đăng nhập (Mật khẩu mặc định: 123456)
INSERT INTO staff (username, password, specialization, employee_id) VALUES ('gv_lan', '123456', 'Toán Cao Cấp', 1);
INSERT INTO ban_giam_hieu (username, password, employee_id) VALUES ('bgh_phat', '123456', 2);
INSERT INTO accountant (username, password, employee_id) VALUES ('kt_hai', '123456', 3);
INSERT INTO admin (username, password, employee_id) VALUES ('admin_thai', '123456', 4);

-- 3. Thêm cột contract_start_date vào bảng employee
ALTER TABLE employee ADD COLUMN contract_start_date DATE AFTER academic_degree;

-- 4. Cập nhật lại ngày Bắt đầu và Kết thúc cho 4 nhân sự gốc
UPDATE employee SET contract_start_date = '2026-01-05', contract_end_date = '2028-01-05' WHERE id = 1;
UPDATE employee SET contract_start_date = '2026-01-10', contract_end_date = '2028-01-10' WHERE id = 2;
UPDATE employee SET contract_start_date = '2026-02-15', contract_end_date = '2028-02-15' WHERE id = 3;
UPDATE employee SET contract_start_date = '2025-03-10', contract_end_date = '2026-03-10' WHERE id = 4;
