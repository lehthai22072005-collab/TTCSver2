CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

-- Xóa bảng theo thứ tự bảng con trước bảng cha
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS accountant;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS employee;

-- 1. Bảng cha chứa thông tin chung
CREATE TABLE employee (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    position VARCHAR(50)
);

-- 2. Các bảng con có username/password để login
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

CREATE TABLE teacher (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subject VARCHAR(50),
    employee_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);


CREATE TABLE ban_giam_hieu (
    bgh_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);



-- Thêm dữ liệu mẫu
INSERT INTO employee (id, full_name, department, position) VALUES 
(1, 'Nguyen Van A', 'Hanh Chinh', 'Nhan Vien'),
(2, 'Tran Thi B', 'Ke Toan', 'Truong Phong'),
(3, 'Le Van C', 'Dao Tao', 'Giang Vien'),
(4, 'Pham Minh D', 'Quan Tri', 'Admin');

INSERT INTO admin (username, password, employee_id) VALUES ('Dinh_Minh', '123456', 4);
INSERT INTO accountant (username, password, employee_id) VALUES ('Hong_Thai', '094321', 2);
INSERT INTO teacher (username, password, subject, employee_id) VALUES ('Ngoc_Hoang', '12345678', 'Co So Du Lieu', 3);



INSERT INTO ban_giam_hieu (username, password) VALUES ('Hoang_Nam', '123456789');

-- Giả sử:
-- admin_id = 1
-- acc_id = 1
-- teacher_id = 1



select * from accountant


