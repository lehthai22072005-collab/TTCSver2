package com.ptit.demo.repository;

import com.ptit.demo.entity.Accountant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AccountantRepository extends JpaRepository<Accountant, Long> {
    // Sử dụng Optional để an toàn hơn trong việc kiểm tra dữ liệu tồn tại
    Optional<Accountant> findByUsername(String username);
}