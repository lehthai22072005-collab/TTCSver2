// File: entity/SystemLog.java
package com.ptit.demo.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_logs")
@Data
public class SystemLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userRole;
    private String action;
    private String details;
    private String noiDung;
    private LocalDateTime timestamp = LocalDateTime.now();
}