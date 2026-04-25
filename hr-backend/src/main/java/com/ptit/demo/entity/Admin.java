package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "admin")
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long id;

    private String username;
    private String password;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}
