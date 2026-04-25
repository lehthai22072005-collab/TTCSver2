package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "teacher")
@Data
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_id")
    private Long id;

    private String username;
    private String password;
    private String subject;

    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}
