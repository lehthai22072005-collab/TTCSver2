package com.ptit.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "system_config")
@Data
public class SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "config_key", unique = true)
    private String configKey;

    @Column(name = "config_value")
    private String configValue;

    private String description;

    // Viết tường minh Setter để tránh lỗi IDE không nhận diện được Lombok
    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }

    public String getConfigValue() {
        return this.configValue;
    }
}