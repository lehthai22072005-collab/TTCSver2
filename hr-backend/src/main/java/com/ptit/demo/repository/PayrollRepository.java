package com.ptit.demo.repository;

import com.ptit.demo.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByTrangThaiChotTrue();
    List<Payroll> findByThangNam(String month);

    // Thêm hàm này để kiểm tra xem tháng đã chốt chưa
    boolean existsByThangNamAndTrangThaiChotTrue(String month);

    @Transactional
    void deleteByThangNamAndTrangThaiChotFalse(String month);
}