package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_evaluation")
@Data
public class KpiEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "hoc_ky", nullable = false)
    private String hocKy;

    @Column(name = "diem_danh_gia")
    private BigDecimal diemDanhGia;

    @Column(name = "so_bai_bao")
    private Integer soBaiBao;

    @Column(name = "xep_loai")
    private String xepLoai;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
