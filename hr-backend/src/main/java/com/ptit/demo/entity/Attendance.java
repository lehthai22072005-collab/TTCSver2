package com.ptit.demo.entity;

// Các import này sẽ sửa toàn bộ lỗi "Cannot resolve symbol Entity, Id, Table, v.v."
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "cham_cong")
@Data // Sửa lỗi "Private field is never used" vì nó tự tạo Getter/Setter
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    // Sửa lỗi "Cannot resolve symbol Employee"
    // Lưu ý: Đảm bảo bạn đã có file Employee.java trong cùng package này
    @ManyToOne
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    private Employee employee;

    private LocalDate ngayCham;
    private LocalTime gioVao;
    private String trangThai;
    private Integer soTietDay;
    private Boolean coDiLam;
}