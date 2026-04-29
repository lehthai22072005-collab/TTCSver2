package com.ptit.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Quan trọng: Phải chỉ định rõ package của Attendance ở đây
@Repository
public interface AttendanceRepository extends JpaRepository<com.ptit.demo.entity.Attendance, Long> {
}