package com.ptit.demo.repository;

import com.ptit.demo.entity.RewardDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardDisciplineRepository extends JpaRepository<RewardDiscipline, Long> {
    List<RewardDiscipline> findByEmployeeId(Long employeeId);

    @Query("SELECT r FROM RewardDiscipline r WHERE r.employee.id = :empId AND DATE_FORMAT(r.effectiveDate, '%m/%Y') = :month")
    List<RewardDiscipline> findByEmployeeIdAndMonth(@Param("empId") Long empId, @Param("month") String month);
}
