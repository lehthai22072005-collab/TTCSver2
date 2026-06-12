package com.ptit.demo.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table(name = "system_logs")
@Data
public class SystemLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nguoi_dung")
    private String userRole;

    @Column(name = "hanh_dong")
    private String noiDung;

    @Column(name = "thoi_gian")
    private String thoiGian;

    @Transient
    private String action;

    @Transient
    private String details;

    public String getTimestamp() {
        return this.thoiGian;
    }

    public void setAction(String action) {
        this.action = action;
        if (this.noiDung == null) {
            this.noiDung = action;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (this.thoiGian == null) {
            this.thoiGian = new SimpleDateFormat("HH:mm dd/MM/yyyy").format(new Date());
        }
    }
}