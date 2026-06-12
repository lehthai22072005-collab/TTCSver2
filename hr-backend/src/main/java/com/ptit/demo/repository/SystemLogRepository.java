// File: repository/SystemLogRepository.java
package com.ptit.demo.repository;
import com.ptit.demo.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
    // Lấy log sắp xếp mới nhất lên đầu
    List<SystemLog> findAllByOrderByIdDesc();
}