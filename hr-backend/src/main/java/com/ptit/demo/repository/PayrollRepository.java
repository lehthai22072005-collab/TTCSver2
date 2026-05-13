package com.ptit.demo.repository;

import com.ptit.demo.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByTrangThaiChotTrue();
    List<Payroll> findByThangNam(String month);

    boolean existsByThangNamAndTrangThaiChotTrue(String month);

    @Transactional
    void deleteByThangNamAndTrangThaiChotFalse(String month);

    // Đếm số ngày đi làm thực tế
    @Query(value = "SELECT COUNT(*) FROM cham_cong WHERE employee_id = :empId " +
            "AND ngay_cham LIKE :monthPattern AND co_di_lam = true", nativeQuery = true)
    int countWorkDays(@Param("empId") Long empId, @Param("monthPattern") String monthPattern);

    // Tính tổng số tiết dạy
    @Query(value = "SELECT SUM(so_tiet_day) FROM cham_cong WHERE employee_id = :empId " +
            "AND ngay_cham LIKE :monthPattern", nativeQuery = true)
    Integer sumTeachingPeriods(@Param("empId") Long empId, @Param("monthPattern") String monthPattern);
}