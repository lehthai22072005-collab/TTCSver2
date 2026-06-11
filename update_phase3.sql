CREATE TABLE IF NOT EXISTS kpi_evaluation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    hoc_ky VARCHAR(50) NOT NULL,
    diem_danh_gia DECIMAL(5,2) DEFAULT 0.0,
    so_bai_bao INT DEFAULT 0,
    xep_loai VARCHAR(50),
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- Insert some mock data for existing employees
INSERT INTO kpi_evaluation (employee_id, hoc_ky, diem_danh_gia, so_bai_bao, xep_loai, ghi_chu)
SELECT id, 'Học kỳ 1 - 2025', 8.5, 2, 'Hoàn thành tốt', 'Đóng góp tốt cho nghiên cứu khoa học'
FROM employee WHERE position = 'Giảng viên' LIMIT 2;
