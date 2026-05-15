package com.ptit.demo.repository;

import com.ptit.demo.entity.MonthlyBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MonthlyBudgetRepository extends JpaRepository<MonthlyBudget, Long> {
    Optional<MonthlyBudget> findByThangNam(String thangNam);
}