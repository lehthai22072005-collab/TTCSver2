package com.ptit.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ban_giam_hieu")
public class Director {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bgh_id")
    private Integer bghId;

    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    // Constructors
    public Director() {}

    public Director(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters and Setters
    public Integer getBghId() {
        return bghId;
    }

    public void setBghId(Integer bghId) {
        this.bghId = bghId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
