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

    // 1. LẤY DANH SÁCH (Đã fix lỗi trống danh sách do map sai key)
    @GetMapping("/list")
    public ResponseEntity<?> getAllAccounts() {
        try {
            String sql =
                    "SELECT a.username, e.full_name, e.email, 'Admin' as role, a.status " +
                            "FROM admin a JOIN employee e ON a.employee_id = e.id " +
                            "UNION ALL " +
                            "SELECT c.username, e.full_name, e.email, 'Kế toán' as role, c.status " +
                            "FROM accountant c JOIN employee e ON c.employee_id = e.id " +
                            "UNION ALL " +
                            "SELECT s.username, e.full_name, e.email, 'Nhân viên' as role, s.status " +
                            "FROM staff s JOIN employee e ON s.employee_id = e.id " +
                            "UNION ALL " +
                            "SELECT b.username, e.full_name, e.email, 'Ban Giám Hiệu' as role, b.status " +
                            "FROM ban_giam_hieu b JOIN employee e ON b.employee_id = e.id";

            List<Map<String, Object>> accounts = jdbcTemplate.query(sql, (rs, rowNum) -> {
                Map<String, Object> map = new HashMap<>();
                map.put("username", rs.getString("username"));
                map.put("fullName", rs.getString("full_name"));
                map.put("email", rs.getString("email"));
                map.put("role", rs.getString("role"));
                map.put("status", rs.getString("status"));
                return map;
            });
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi lấy danh sách: " + e.getMessage());
        }
    }

    // 2. TẠO TÀI KHOẢN MỚI (Đã bọc Try-Catch để báo lỗi rõ ràng)
    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Map<String, String> data) {
        try {
            Employee emp = new Employee();
            emp.setFullName(data.get("fullName"));
            emp.setEmail(data.get("email"));
            emp = employeeRepository.save(emp);

            String table = getTableName(data.get("role"));
            String sql = "INSERT INTO " + table + " (username, password, employee_id, status) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(sql, data.get("username"), data.get("password"), emp.getId(), data.get("status"));

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

            Long empId = jdbcTemplate.queryForObject("SELECT employee_id FROM " + oldTable + " WHERE username = ?", Long.class, oldUsername);

            if(empId != null) {
                Employee emp = employeeRepository.findById(empId).orElse(null);
                if(emp != null) {
                    emp.setFullName(data.get("fullName"));
                    emp.setEmail(data.get("email"));
                    employeeRepository.save(emp);
                }
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

            return ResponseEntity.ok(Map.of("message", "Đã thay đổi trạng thái tài khoản!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi DB: " + e.getMessage()));
        }
    }
}