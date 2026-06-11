CREATE TABLE IF NOT EXISTS teaching_declaration (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    hoc_ky VARCHAR(50) NOT NULL,
    so_tiet_day INT DEFAULT 0,
    so_bai_bao INT DEFAULT 0,
    trang_thai VARCHAR(50) DEFAULT 'CHỜ DUYỆT',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
