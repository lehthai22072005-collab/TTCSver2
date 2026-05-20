package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin("*")
public class AccountController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private EmployeeRepository employeeRepository;

    private String getTableName(String role) {
        switch (role) {
            case "Admin": return "admin";
            case "Kế toán": return "accountant";
            case "Nhân viên": return "staff";
            case "Ban Giám Hiệu": return "ban_giam_hieu";
            default: return "staff";
        }
    }

    // 1. LẤY DANH SÁCH (Đã thêm lấy e.id để Frontend nhận diện được nhân viên)
    @GetMapping("/list")
    public ResponseEntity<?> getAllAccounts() {
        try {
            String sql =
                    "SELECT e.id as employee_id, e.full_name, e.email, " +
                            "COALESCE(a.username, c.username, s.username, b.username) as username, " +
                            "CASE " +
                            "WHEN a.username IS NOT NULL THEN 'Admin' " +
                            "WHEN c.username IS NOT NULL THEN 'Kế toán' " +
                            "WHEN b.username IS NOT NULL THEN 'Ban Giám Hiệu' " +
                            "WHEN s.username IS NOT NULL THEN 'Nhân viên' " +
                            "ELSE 'Chưa cấp quyền' " +
                            "END as role, " +
                            "COALESCE(a.status, c.status, s.status, b.status, 'No Account') as status " +
                            "FROM employee e " +
                            "LEFT JOIN admin a ON e.id = a.employee_id " +
                            "LEFT JOIN accountant c ON e.id = c.employee_id " +
                            "LEFT JOIN staff s ON e.id = s.employee_id " +
                            "LEFT JOIN ban_giam_hieu b ON e.id = b.employee_id";

            List<Map<String, Object>> accounts = jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> map = new HashMap<>();

                map.put("employeeId", rs.getString("employee_id")); // QUAN TRỌNG: Lấy ID gửi về React

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
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi lấy danh sách: " + e.getMessage());
        }
    }

    // 2. TẠO TÀI KHOẢN MỚI (Thông minh: Xử lý cả cấp cho người cũ và tạo người mới)
    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, String> data) {
        try {
            Long empId;
            String empIdStr = data.get("employeeId");

            // Nếu frontend gửi lên employeeId -> Tức là cấp tài khoản cho người đã có sẵn (như thai ngau loi)
            if (empIdStr != null && !empIdStr.trim().isEmpty()) {
                empId = Long.parseLong(empIdStr);
            } else {
                // Nếu không có employeeId -> Nút [+ Tạo User] -> Tạo mới hoàn toàn 1 nhân viên vào DB
                Employee emp = new Employee();
                emp.setFullName(data.get("fullName"));
                emp.setEmail(data.get("email"));
                emp = employeeRepository.save(emp);
                empId = emp.getId();
            }

            String table = getTableName(data.get("role"));
            String sql = "INSERT INTO " + table + " (username, password, employee_id, status) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(sql, data.get("username"), data.get("password"), empId, data.get("status") != null ? data.get("status") : "Active");

            return ResponseEntity.ok(Map.of("message", "Tạo tài khoản thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi tạo User: " + e.getMessage()));
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

            String oldTable = getTableName(oldRole);
            String newTable = getTableName(newRole);

            List<Long> ids = jdbcTemplate.queryForList("SELECT employee_id FROM " + oldTable + " WHERE username = ?", Long.class, oldUsername);
            if (ids.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy TK cũ."));
            Long empId = ids.get(0);

            Employee emp = employeeRepository.findById(empId).orElse(null);
            if(emp != null) {
                emp.setFullName(data.get("fullName"));
                emp.setEmail(data.get("email"));
                employeeRepository.save(emp);
            }

            if (!oldRole.equals(newRole)) {
                jdbcTemplate.update("DELETE FROM " + oldTable + " WHERE username = ?", oldUsername);
                jdbcTemplate.update("INSERT INTO " + newTable + " (username, password, employee_id, status) VALUES (?, ?, ?, ?)",
                        username, (password != null && !password.isEmpty()) ? password : "123", empId, status);
            } else {
                jdbcTemplate.update("UPDATE " + oldTable + " SET username = ?, status = ? WHERE username = ?", username, status, oldUsername);
                if (password != null && !password.trim().isEmpty()) {
                    jdbcTemplate.update("UPDATE " + oldTable + " SET password = ? WHERE username = ?", password, username);
                }
            }
            return ResponseEntity.ok(Map.of("message", "Cập nhật tài khoản thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
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

            String sql = "UPDATE " + getTableName(role) + " SET status = ? WHERE username = ?";
            jdbcTemplate.update(sql, newStatus, username);

            return ResponseEntity.ok(Map.of("message", "Đã thay đổi trạng thái!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi DB: " + e.getMessage()));
        }
    }
}