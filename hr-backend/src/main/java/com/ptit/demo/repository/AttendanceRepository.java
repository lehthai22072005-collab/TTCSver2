package com.ptit.demo.repository;

import com.ptit.demo.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // THÊM MỚI: Lấy danh sách chấm công của riêng một nhân viên cụ thể
    List<Attendance> findByEmployeeId(Long employeeId);
}