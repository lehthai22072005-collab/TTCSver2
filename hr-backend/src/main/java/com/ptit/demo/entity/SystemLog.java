package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "system_logs")
public class SystemLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userRole;
    private String action;
    private String details;
    private String noiDung; // Thêm trường này
    private LocalDateTime timestamp = LocalDateTime.now();
}