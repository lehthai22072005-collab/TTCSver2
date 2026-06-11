package com.ptit.demo.repository;

import com.ptit.demo.entity.KpiEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiEvaluationRepository extends JpaRepository<KpiEvaluation, Long> {
    List<KpiEvaluation> findByEmployeeId(Long employeeId);
    List<KpiEvaluation> findByHocKy(String hocKy);
}
