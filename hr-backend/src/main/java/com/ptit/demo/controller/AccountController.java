package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import com.ptit.demo.service.SystemConfigService;
import com.ptit.demo.service.EmailService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin("*")
public class AccountController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private SystemConfigService configService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private EmployeeRepository employeeRepository;

    private String getTableName(String role) {
        switch (role) {
            case "Admin":
                return "admin";
            case "Kế toán":
                return "accountant";
            case "Nhân viên":
                return "staff";
            case "Ban Giám Hiệu":
                return "ban_giam_hieu";
            case "Phòng nhân sự":
                return "human_resources";
            default:
                return "staff";
        }
    }

    // --- HÀM HỖ TRỢ GHI LOG TỰ ĐỘNG ---
    private void ghiLogHeThong(String hanhDong, String nguoiDung) {
        try {
            // Lấy thời gian hiện tại chuẩn định dạng "HH:mm dd/MM/yyyy"
            String thoiGian = new java.text.SimpleDateFormat("HH:mm dd/MM/yyyy").format(new java.util.Date());

            // Lưu vào bảng system_logs. (Nếu tên cột của bạn khác, hãy sửa lại cho khớp
            // nhé)
            String sql = "INSERT INTO system_logs (thoi_gian, hanh_dong, nguoi_dung) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, thoiGian, hanhDong, nguoiDung);
        } catch (Exception e) {
            System.out.println("Lỗi ghi log: " + e.getMessage());
        }
    }

    // 1. LẤY DANH SÁCH
    @GetMapping("/list")
    public ResponseEntity<?> getAllAccounts() {
        try {
            String sql = "SELECT e.id as employee_id, e.full_name, e.email, " +
                    "COALESCE(a.username, c.username, s.username, b.username, h.username) as username, " +
                    "CASE " +
                    "WHEN a.username IS NOT NULL THEN 'Admin' " +
                    "WHEN c.username IS NOT NULL THEN 'Kế toán' " +
                    "WHEN b.username IS NOT NULL THEN 'Ban Giám Hiệu' " +
                    "WHEN h.username IS NOT NULL THEN 'Phòng nhân sự' " +
                    "WHEN s.username IS NOT NULL THEN 'Nhân viên' " +
                    "ELSE 'Chưa cấp quyền' " +
                    "END as role, " +
                    "COALESCE(a.status, c.status, s.status, b.status, h.status, 'No Account') as status " +
                    "FROM employee e " +
                    "LEFT JOIN admin a ON e.id = a.employee_id " +
                    "LEFT JOIN accountant c ON e.id = c.employee_id " +
                    "LEFT JOIN staff s ON e.id = s.employee_id " +
                    "LEFT JOIN ban_giam_hieu b ON e.id = b.employee_id " +
                    "LEFT JOIN human_resources h ON e.id = h.employee_id";

            List<Map<String, Object>> accounts = jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> map = new HashMap<>();
                map.put("employeeId", rs.getString("employee_id"));
                String username = rs.getString("username");
                map.put("username", username != null ? username : "[ Chưa có tài khoản ]");
                map.put("fullName", rs.getString("full_name"));
                map.put("email", rs.getString("email"));
                map.put("role", rs.getString("role"));
                String status = rs.getString("status");
                map.put("status", status.equals("No Account") ? "Chưa kích hoạt" : status);
                return map;
            });
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy danh sách: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, String> data) {
        try {
            Long empId;
            String empIdStr = data.get("employeeId");
            String actionBy = data.get("actionBy");

            Employee emp;

            if (empIdStr != null && !empIdStr.trim().isEmpty()) {
                empId = Long.parseLong(empIdStr);

                emp = employeeRepository.findById(empId).orElse(null);

                if (emp == null) {
                    return ResponseEntity.status(404).body(Map.of(
                            "message", "Không tìm thấy nhân viên!"));
                }
            } else {
                String email = data.get("email");
                List<Long> existingIds = jdbcTemplate.queryForList("SELECT id FROM employee WHERE email = ?", Long.class, email);
                
                if (!existingIds.isEmpty()) {
                    // Nếu nhân viên đã tồn tại, dùng luôn hồ sơ đó
                    empId = existingIds.get(0);
                    emp = employeeRepository.findById(empId).orElse(null);
                } else {
                    // Nếu chưa tồn tại, tạo hồ sơ nhân viên mới
                    emp = new Employee();
                    emp.setFullName(data.get("fullName"));
                    emp.setEmail(email);
                    emp = employeeRepository.save(emp);
                    empId = emp.getId();
                }
            }

            String username = data.get("username");
            String password = data.get("password");
            String role = data.get("role");
            String status = data.get("status") != null ? data.get("status") : "Active";

            String table = getTableName(role);

            String sql = "INSERT INTO " + table + " (username, password, employee_id, status) VALUES (?, ?, ?, ?)";

            jdbcTemplate.update(sql, username, password, empId, status);

            ghiLogHeThong("Tạo tài khoản mới: " + username, actionBy);

            String emailMessage;

            try {
                if (emp.getEmail() != null && !emp.getEmail().trim().isEmpty()) {
                    emailMessage = emailService.sendAccountCreatedEmail(
                            emp.getEmail(),
                            emp.getFullName(),
                            username,
                            password,
                            role);
                } else {
                    emailMessage = "Nhân viên chưa có email nên không gửi thông báo tài khoản.";
                }
            } catch (Exception emailEx) {
                emailMessage = "Tạo tài khoản thành công nhưng gửi email thất bại: " + emailEx.getMessage();
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Tạo tài khoản thành công!",
                    "emailMessage", emailMessage));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Lỗi tạo User: " + e.getMessage()));
        }
    }

    // 3. SỬA TÀI KHOẢN
    @PostMapping("/update")
    public ResponseEntity<?> updateAccount(@RequestBody Map<String, String> data) {
        try {
            String oldUsername = data.get("oldUsername");
            String oldRole = data.get("oldRole");
            String newRole = data.get("role");
            String username = data.get("username");
            String password = data.get("password");
            String status = data.get("status");
            String actionBy = data.get("actionBy");

            String oldTable = getTableName(oldRole);
            String newTable = getTableName(newRole);

            List<Long> ids = jdbcTemplate.queryForList("SELECT employee_id FROM " + oldTable + " WHERE username = ?",
                    Long.class, oldUsername);
            if (ids.isEmpty())
                return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy TK cũ."));
            Long empId = ids.get(0);

            Employee emp = employeeRepository.findById(empId).orElse(null);
            if (emp != null) {
                emp.setFullName(data.get("fullName"));
                emp.setEmail(data.get("email"));
                employeeRepository.save(emp);
            }

            if (!oldRole.equals(newRole)) {
                jdbcTemplate.update("DELETE FROM " + oldTable + " WHERE username = ?", oldUsername);
                jdbcTemplate.update(
                        "INSERT INTO " + newTable + " (username, password, employee_id, status) VALUES (?, ?, ?, ?)",
                        username, (password != null && !password.isEmpty()) ? password : "123", empId, status);
            } else {
                jdbcTemplate.update("UPDATE " + oldTable + " SET username = ?, status = ? WHERE username = ?", username,
                        status, oldUsername);
                if (password != null && !password.trim().isEmpty()) {
                    jdbcTemplate.update("UPDATE " + oldTable + " SET password = ? WHERE username = ?", password,
                            username);
                }
            }

            if ("Active".equalsIgnoreCase(status)) {
                jdbcTemplate.update(
                        "INSERT INTO login_attempts(username, fail_count) VALUES (?, 0) " +
                                "ON DUPLICATE KEY UPDATE fail_count = 0",
                        username);
            }

            // GỌI HÀM GHI LOG
            ghiLogHeThong("Cập nhật tài khoản: " + oldUsername, actionBy);

            return ResponseEntity.ok(Map.of("message", "Cập nhật tài khoản thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi cập nhật: " + e.getMessage()));
        }
    }

    // 4. KHÓA / MỞ KHÓA
    @PostMapping("/toggle-status")
    public ResponseEntity<?> toggleStatus(@RequestBody Map<String, String> data) {
        try {
            String username = data.get("username");
            String role = data.get("role");
            String currentStatus = data.get("status");
            String newStatus = currentStatus.equals("Active") ? "Locked" : "Active";
            String actionBy = data.get("actionBy");

            String sql = "UPDATE " + getTableName(role) + " SET status = ? WHERE username = ?";
            jdbcTemplate.update(sql, newStatus, username);

            if ("Active".equalsIgnoreCase(newStatus)) {
                jdbcTemplate.update(
                        "INSERT INTO login_attempts(username, fail_count) VALUES (?, 0) " +
                                "ON DUPLICATE KEY UPDATE fail_count = 0",
                        username);
            }

            // GỌI HÀM GHI LOG
            String actionName = (newStatus.equals("Locked") ? "Khóa" : "Mở khóa") + " tài khoản: " + username;
            ghiLogHeThong(actionName, actionBy);

            return ResponseEntity.ok(Map.of("message", "Đã thay đổi trạng thái!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi DB: " + e.getMessage()));
        }
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getSystemLogs() {
        try {
            // ĐÃ FIX: Bỏ LIMIT 5 để Frontend tự do phân trang toàn bộ dữ liệu
            String sql = "SELECT thoi_gian, hanh_dong, nguoi_dung FROM system_logs ORDER BY id DESC";
            List<Map<String, Object>> logs = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi lấy log: " + e.getMessage()));
        }
    }



    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> data) {
        try {
            String username = data.get("username");
            String role = data.get("role");
            String oldPassword = data.get("oldPassword");
            String newPassword = data.get("newPassword");

            int minPasswordLength = configService.getInt("minPasswordLength", 8);

            if (newPassword == null || newPassword.length() < minPasswordLength) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Mật khẩu mới phải có ít nhất " + minPasswordLength + " ký tự!"));
            }

            String table = "staff";

            if ("ADMIN".equals(role)) {
                table = "admin";
            } else if ("ACCOUNTANT".equals(role)) {
                table = "accountant";
            } else if ("DIRECTOR".equals(role)) {
                table = "ban_giam_hieu";
            } else if ("HR".equals(role)) {
                table = "human_resources";
            }

            String sqlCheck = "SELECT password FROM " + table + " WHERE username = ?";
            List<String> passwords = jdbcTemplate.queryForList(sqlCheck, String.class, username);

            if (passwords.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                        "message", "Lỗi: Không tìm thấy tài khoản trong CSDL!"));
            }

            if (!passwords.get(0).equals(oldPassword)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Mật khẩu hiện tại không chính xác!"));
            }

            String sqlUpdate = "UPDATE " + table + " SET password = ? WHERE username = ?";
            jdbcTemplate.update(sqlUpdate, newPassword, username);

            ghiLogHeThong("Đổi mật khẩu cá nhân", username);

            return ResponseEntity.ok(Map.of(
                    "message", "Đổi mật khẩu thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
}