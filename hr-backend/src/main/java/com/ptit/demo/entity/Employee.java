package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "employee") // Chỉ định rõ tên bảng trong DB
@Data 
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name") // Khớp với snake_case trong SQL
    private String fullName;

    private String department;
    private String position;
}