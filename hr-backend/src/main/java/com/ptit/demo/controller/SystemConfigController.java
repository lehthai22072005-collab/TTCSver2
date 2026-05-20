package com.ptit.demo.controller;

import com.ptit.demo.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
@CrossOrigin("*")
public class SystemConfigController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SystemConfigService configService;

    @GetMapping({"", "/"})
    public ResponseEntity<?> getAllConfigs() {
        try {
            List<Map<String, Object>> configs = jdbcTemplate.queryForList(
                    "SELECT config_key, config_value FROM system_config"
            );

            Map<String, String> configMap = new HashMap<>();

            for (Map<String, Object> row : configs) {
                String key = String.valueOf(row.get("config_key"));
                String value = String.valueOf(row.get("config_value"));

                // Không trả App Password thật về frontend
                if ("smtpPassword".equals(key)) {
                    configMap.put(key, "");
                } else {
                    configMap.put(key, value);
                }
            }

            return ResponseEntity.ok(configMap);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("message", "Lỗi tải cấu hình: " + e.getMessage())
            );
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateConfigs(@RequestBody Map<String, String> data) {
        try {
            String actionBy = data.remove("actionBy");

            if (actionBy == null || actionBy.trim().isEmpty()) {
                actionBy = "System";
            }

            String sql = """
                    INSERT INTO system_config (config_key, config_value, description)
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        config_value = VALUES(config_value),
                        description = VALUES(description)
                    """;

            for (Map.Entry<String, String> entry : data.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                // Nếu App Password để trống thì giữ mật khẩu cũ trong DB
                if ("smtpPassword".equals(key) && (value == null || value.trim().isEmpty())) {
                    continue;
                }

                jdbcTemplate.update(sql, key, value, getDescription(key));
            }

            String thoiGian = new SimpleDateFormat("HH:mm dd/MM/yyyy").format(new Date());

            jdbcTemplate.update(
                    "INSERT INTO system_logs (thoi_gian, hanh_dong, nguoi_dung) VALUES (?, ?, ?)",
                    thoiGian,
                    "Cập nhật cấu hình hệ thống",
                    actionBy
            );

            return ResponseEntity.ok(Map.of("message", "Lưu cấu hình hệ thống thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("message", "Lỗi lưu cấu hình: " + e.getMessage())
            );
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getSystemStatus() {
        return ResponseEntity.ok(Map.of(
                "maintenanceMode", configService.getBoolean("maintenanceMode", false),
                "minPasswordLength", configService.getInt("minPasswordLength", 8),
                "maxLoginAttempts", configService.getInt("maxLoginAttempts", 5),
                "emailEnabled", configService.getBoolean("emailEnabled", false)
        ));
    }

    private String getDescription(String key) {
        return switch (key) {
            case "minPasswordLength" -> "Độ dài mật khẩu tối thiểu";
            case "maxLoginAttempts" -> "Số lần đăng nhập sai tối đa";
            case "maintenanceMode" -> "Chế độ bảo trì hệ thống";
            case "emailEnabled" -> "Bật hoặc tắt chức năng gửi email";
            case "smtpUsername" -> "Gmail dùng để gửi mail";
            case "smtpPassword" -> "App Password Gmail";
            case "senderName" -> "Tên người gửi email";
            default -> "Cấu hình hệ thống";
        };
    }
}