ALTER TABLE employee ADD COLUMN nhom_nhan_su VARCHAR(50) DEFAULT 'Cán bộ hành chính';
ALTER TABLE employee ADD COLUMN loai_giang_vien VARCHAR(50);
ALTER TABLE employee ADD COLUMN hoc_ham VARCHAR(50);
ALTER TABLE employee ADD COLUMN ngach_cong_chuc VARCHAR(50);
ALTER TABLE employee ADD COLUMN bac_luong INT DEFAULT 1;

UPDATE employee SET nhom_nhan_su='Giảng viên', loai_giang_vien='Cơ hữu', hoc_ham='Thạc sĩ' WHERE position='Giảng viên';
UPDATE employee SET nhom_nhan_su='Ban Giám Hiệu', ngach_cong_chuc='Chuyên viên cao cấp', bac_luong=6 WHERE position='Hiệu trưởng';
UPDATE employee SET nhom_nhan_su='Cán bộ hành chính', ngach_cong_chuc='Chuyên viên', bac_luong=3 WHERE position='Kế toán';
UPDATE employee SET nhom_nhan_su='Cán bộ hành chính', ngach_cong_chuc='Chuyên viên', bac_luong=4 WHERE position='Quản trị viên';
UPDATE employee SET nhom_nhan_su='Cán bộ hành chính', ngach_cong_chuc='Chuyên viên chính', bac_luong=5 WHERE position='Trưởng phòng';
