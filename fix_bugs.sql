ALTER TABLE teaching_declaration ADD COLUMN is_paid BOOLEAN DEFAULT FALSE;

UPDATE employee SET nhom_nhan_su = 'Giảng viên' WHERE email LIKE '%nguyen%';
UPDATE employee SET nhom_nhan_su = 'Hành chính' WHERE email NOT LIKE '%nguyen%';
