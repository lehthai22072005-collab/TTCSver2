package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "staff") // <--- Quan trọng: Chỉ định map vào bảng staff trong DB
@Data
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staff_id; // Đổi tên cho khớp với DB

    private String username;
    private String password;
    private String specialization;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}