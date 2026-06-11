package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "teaching_declaration")
@Data
public class TeachingDeclaration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "hoc_ky", nullable = false)
    private String hocKy;

    @Column(name = "so_tiet_day")
    private Integer soTietDay;

    @Column(name = "so_bai_bao")
    private Integer soBaiBao;

    @Column(name = "trang_thai")
    private String trangThai; // CHỜ DUYỆT, ĐÃ DUYỆT, TỪ CHỐI

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "is_paid")
    private Boolean isPaid;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
