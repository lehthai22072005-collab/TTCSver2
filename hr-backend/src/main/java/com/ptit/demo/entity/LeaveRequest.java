package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private String employeeName;
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    private String reason;
    private String status; // PENDING, APPROVED, REJECTED
}
