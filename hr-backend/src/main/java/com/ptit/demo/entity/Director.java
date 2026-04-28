package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ban_giam_hieu") // <--- Map vào bảng ban_giam_hieu
@Data
public class Director {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bgh_id;

    private String username;
    private String password;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}