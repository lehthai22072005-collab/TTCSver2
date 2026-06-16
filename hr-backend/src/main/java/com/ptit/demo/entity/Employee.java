package com.ptit.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @JsonIgnore
    @Column(name = "department")
    private String legacyDepartmentName;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department departmentEntity;

    @JsonIgnore
    @Transient
    private Long requestedDepartmentId;

    @Column(name = "position")
    private String position;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "academic_degree")
    private String academicDegree;

    // CỘT MỚI: NGÀY BẮT ĐẦU HỢP ĐỒNG (Dùng vẽ đường Tuyển mới)
    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @Column(name = "base_salary")
    private BigDecimal baseSalary;

    @Column(name = "nhom_nhan_su")
    private String nhomNhanSu;

    @Column(name = "loai_giang_vien")
    private String loaiGiangVien;

    @Column(name = "hoc_ham")
    private String hocHam;

    @Column(name = "ngach_cong_chuc")
    private String ngachCongChuc;

    @Column(name = "bac_luong")
    private Integer bacLuong;

    @JsonProperty("department")
    public String getDepartment() {
        if (departmentEntity != null && departmentEntity.getName() != null) {
            return departmentEntity.getName();
        }
        return legacyDepartmentName;
    }

    @JsonProperty("department")
    public void setDepartment(String department) {
        this.legacyDepartmentName = department;
    }

    @JsonProperty("departmentId")
    public Long getDepartmentId() {
        if (departmentEntity != null) {
            return departmentEntity.getId();
        }
        return requestedDepartmentId;
    }

    @JsonProperty("departmentId")
    public void setDepartmentId(Long departmentId) {
        this.requestedDepartmentId = departmentId;
    }
}
