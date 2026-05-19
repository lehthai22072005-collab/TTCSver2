package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "department")
    private String department;

    @Column(name = "position")
    private String position;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "academic_degree")
    private String academicDegree;

    // CỘT MỚI: NGÀY BẮT ĐẦU HỢP ĐỒNG (Dùng vẽ đường Tuyển mới)
    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    // CỘT CŨ: NGÀY KẾT THÚC HỢP ĐỒNG (Dùng vẽ đường Thôi việc & Trạng thái)
    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @Column(name = "base_salary")
    private BigDecimal baseSalary;
}