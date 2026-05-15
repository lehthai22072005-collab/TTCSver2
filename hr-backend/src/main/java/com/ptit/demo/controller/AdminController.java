package com.ptit.demo.controller;

import com.ptit.demo.entity.SystemConfig;
import com.ptit.demo.entity.SystemLog;
import com.ptit.demo.repository.SystemConfigRepository;
import com.ptit.demo.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
@SuppressWarnings({"SpellCheckingInspection", "unused"}) // Tắt cảnh báo chính tả và biến chưa xài
public class AdminController {

    @Autowired
    private SystemLogRepository systemLogRepository;

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    // ==========================================
    // 1. TAB: SYSTEM LOGS
    // ==========================================
    @GetMapping("/logs")
    public ResponseEntity<?> getAllLogs() {
        return ResponseEntity.ok(systemLogRepository.findAllByOrderByTimestampDesc());
    }

    // ==========================================
    // 2. TAB: CẤU HÌNH HỆ THỐNG
    // ==========================================
    @GetMapping("/config")
    public ResponseEntity<?> getAllConfigs() {
        return ResponseEntity.ok(systemConfigRepository.findAll());
    }

    @PostMapping("/config/update")
    public ResponseEntity<?> updateConfig(@RequestBody Map<String, String> payload) {
        payload.forEach((key, value) -> {
            SystemConfig config = systemConfigRepository.findByConfigKey(key);
            if (config != null) {
                config.setConfigValue(value);
                systemConfigRepository.save(config);
            }
        });

        SystemLog log = new SystemLog();
        log.setUserRole("ADMIN");
        log.setAction("UPDATE CONFIG");
        log.setNoiDung("Admin vừa thay đổi cấu hình hệ thống");
        systemLogRepository.save(log);

        return ResponseEntity.ok(Map.of("message", "Cập nhật cấu hình thành công!"));
    }

    // ==========================================
    // 3. TAB: DASHBOARD HỆ THỐNG
    // ==========================================
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalAccounts", 5);
        stats.put("activeAccounts", 4);
        stats.put("lockedAccounts", 1);

        List<SystemLog> recentLogs = systemLogRepository.findAllByOrderByTimestampDesc();
        stats.put("recentLogs", recentLogs.size() > 5 ? recentLogs.subList(0, 5) : recentLogs);

        return ResponseEntity.ok(stats);
    }

    // ==========================================
    // 4. TAB: ĐỔI MẬT KHẨU
    // ==========================================
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String oldPass = request.get("oldPassword");
        String newPass = request.get("newPassword");

        // Tạm thời để log ra console để hết báo lỗi "never used", sau này nối DB tài khoản thì code tiếp ở đây
        System.out.println("Yêu cầu đổi pass cho user: " + username);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
    }
}