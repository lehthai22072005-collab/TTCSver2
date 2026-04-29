package com.ptit.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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



    @Column(name = "academic_degree")
    @JsonProperty("academicDegree") // Ép tên key JSON trả về Frontend
    private String academicDegree;

    @Column(name = "contract_end_date")
    @JsonProperty("contractEndDate") // Ép tên key JSON trả về Frontend
    private LocalDate contractEndDate;
}