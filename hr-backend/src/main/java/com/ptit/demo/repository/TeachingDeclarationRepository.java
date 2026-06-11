package com.ptit.demo.repository;

import com.ptit.demo.entity.TeachingDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeachingDeclarationRepository extends JpaRepository<TeachingDeclaration, Long> {
    List<TeachingDeclaration> findByEmployeeId(Long employeeId);
    List<TeachingDeclaration> findByTrangThai(String trangThai);
    
    @Query("SELECT t FROM TeachingDeclaration t WHERE t.employee.id = :empId AND t.trangThai = :trangThai AND (t.isPaid = false OR t.isPaid IS NULL)")
    List<TeachingDeclaration> findValidUnpaidDeclarations(@Param("empId") Long empId, @Param("trangThai") String trangThai);
}
