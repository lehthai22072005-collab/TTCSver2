package com.ptit.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String phone;

    private String department;

    private String position;

    // ĐÃ THÊM: Lương cơ bản gốc của nhân viên
    @Column(name = "base_salary")
    @JsonProperty("baseSalary")
    private BigDecimal baseSalary;

    @Column(name = "academic_degree")
    @JsonProperty("academicDegree")
    private String academicDegree;

    @Column(name = "contract_end_date")
    @JsonProperty("contractEndDate")
    private LocalDate contractEndDate;
}