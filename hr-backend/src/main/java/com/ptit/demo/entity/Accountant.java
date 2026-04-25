package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "accountant")
@Data
public class Accountant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "acc_id")
    private Long id;

    private String username;
    private String password;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}
