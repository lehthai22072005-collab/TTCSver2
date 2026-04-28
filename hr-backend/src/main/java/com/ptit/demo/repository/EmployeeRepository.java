package com.ptit.demo.repository;

import com.ptit.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Không cần viết gì thêm ở đây, JpaRepository đã lo hết các hàm findAll, save, delete...
}