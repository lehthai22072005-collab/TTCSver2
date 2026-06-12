package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "human_resources")
@Data
public class Hr {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hr_id")
    private Long id;

    private String username;
    private String password;
    private String status = "Active";

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}
