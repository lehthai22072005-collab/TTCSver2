package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bang_luong")
@Data
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) // Ép hệ thống lấy luôn thông tin nhân viên
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "thang_nam")
    private String thangNam;

    @Column(name = "luong_co_ban")
    private BigDecimal luongCoBan;

    @Column(name = "phu_cap")
    private BigDecimal phuCap;

    @Column(name = "thuc_linh")
    private BigDecimal thucLinh;

    @Column(name = "trang_thai_chot")
    private Boolean trangThaiChot;

    @Column(name = "ngay_chot")
    private LocalDateTime ngayChot;

    @Column(name = "ngay_cong")
    private Integer ngayCong;

    @Column(name = "tiet_day")
    private Integer tietDay;
}