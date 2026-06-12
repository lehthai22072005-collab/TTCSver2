package com.ptit.demo.controller;

import com.ptit.demo.dto.LoginRequest;
import com.ptit.demo.dto.LoginResponse;
import com.ptit.demo.entity.*;
import com.ptit.demo.repository.*;
import com.ptit.demo.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AccountantRepository accountantRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private DirectorRepository directorRepository;

    @Autowired
    private HrRepository hrRepository;

    @Autowired
    private SystemConfigService configService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        if (isAccountLockedInDatabase(username)) {
            return ResponseEntity.badRequest().body(new LoginResponse(
                    false,
                    "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.",
                    null,
                    null,
                    null
            ));
        }

        boolean maintenanceMode = configService.getBoolean("maintenanceMode", false);
        int maxLoginAttempts = configService.getInt("maxLoginAttempts", 5);

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);

        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            resetFailCount(username);

            Admin admin = adminOpt.get();

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Đăng nhập thành công",
                    "ADMIN",
                    admin.getEmployee() != null ? admin.getEmployee().getId() : null,
                    admin.getEmployee() != null ? admin.getEmployee().getFullName() : "Admin"
            ));
        }

        if (maintenanceMode) {
            return ResponseEntity.status(503).body(new LoginResponse(
                    false,
                    "Hệ thống đang bảo trì. Chỉ Admin được phép đăng nhập.",
                    null,
                    null,
                    null
            ));
        }

        int currentFailCount = getFailCount(username);

        if (currentFailCount >= maxLoginAttempts) {
            lockAccountInDatabase(username);
            return ResponseEntity.badRequest().body(new LoginResponse(
                    false,
                    "Tài khoản đã bị khóa do nhập sai quá " + maxLoginAttempts + " lần.",
                    null,
                    null,
                    null
            ));
        }

        Optional<Teacher> teacherOpt = teacherRepository.findByUsername(username);

        if (teacherOpt.isPresent() && teacherOpt.get().getPassword().equals(password)) {
            resetFailCount(username);

            Teacher staffAccount = teacherOpt.get();
            String finalRole = "STAFF";

            if (staffAccount.getEmployee() != null &&
                    "Giảng viên".equalsIgnoreCase(staffAccount.getEmployee().getNhomNhanSu())) {
                finalRole = "TEACHER";
            }

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Đăng nhập thành công",
                    finalRole,
                    staffAccount.getEmployee() != null ? staffAccount.getEmployee().getId() : null,
                    staffAccount.getEmployee() != null ? staffAccount.getEmployee().getFullName() : "Nhân sự"
            ));
        }

        Optional<Accountant> accountantOpt = accountantRepository.findByUsername(username);

        if (accountantOpt.isPresent() && accountantOpt.get().getPassword().equals(password)) {
            resetFailCount(username);

            Accountant accountant = accountantOpt.get();

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Đăng nhập thành công",
                    "ACCOUNTANT",
                    accountant.getEmployee() != null ? accountant.getEmployee().getId() : null,
                    accountant.getEmployee() != null ? accountant.getEmployee().getFullName() : "Kế toán"
            ));
        }

        Optional<Director> directorOpt = directorRepository.findByUsername(username);

        if (directorOpt.isPresent() && directorOpt.get().getPassword().equals(password)) {
            resetFailCount(username);

            Director director = directorOpt.get();

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Đăng nhập thành công",
                    "DIRECTOR",
                    director.getEmployee() != null ? director.getEmployee().getId() : null,
                    director.getEmployee() != null ? director.getEmployee().getFullName() : "Ban Giám Hiệu"
            ));
        }

        Optional<Hr> hrOpt = hrRepository.findByUsername(username);

        if (hrOpt.isPresent() && hrOpt.get().getPassword().equals(password)) {
            resetFailCount(username);

            Hr hr = hrOpt.get();

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Đăng nhập thành công",
                    "HR",
                    hr.getEmployee() != null ? hr.getEmployee().getId() : null,
                    hr.getEmployee() != null ? hr.getEmployee().getFullName() : "Phòng nhân sự"
            ));
        }

        increaseFailCount(username);

        int afterFailCount = getFailCount(username);

        if (afterFailCount >= maxLoginAttempts) {
            lockAccountInDatabase(username);
            return ResponseEntity.badRequest().body(new LoginResponse(
                    false,
                    "Tài khoản đã bị khóa do nhập sai quá " + maxLoginAttempts + " lần.",
                    null,
                    null,
                    null
            ));
        }

        return ResponseEntity.badRequest().body(new LoginResponse(
                false,
                "Sai username hoặc password. Số lần sai: " + afterFailCount + "/" + maxLoginAttempts,
                null,
                null,
                null
        ));
    }

    private boolean isAccountLockedInDatabase(String username) {
        String[] tables = {"admin", "staff", "accountant", "ban_giam_hieu", "human_resources"};
        for (String table : tables) {
            try {
                List<String> statusList = jdbcTemplate.queryForList(
                        "SELECT status FROM " + table + " WHERE username = ?",
                        String.class,
                        username
                );
                if (!statusList.isEmpty() && "Locked".equalsIgnoreCase(statusList.get(0))) {
                    return true;
                }
            } catch (Exception e) {
                // Ignore
            }
        }
        return false;
    }

    private void lockAccountInDatabase(String username) {
        String[] tables = {"admin", "staff", "accountant", "ban_giam_hieu", "human_resources"};
        for (String table : tables) {
            try {
                jdbcTemplate.update("UPDATE " + table + " SET status = 'Locked' WHERE username = ?", username);
            } catch (Exception e) {
                // Ignore
            }
        }
    }

    private int getFailCount(String username) {
        try {
            List<Integer> result = jdbcTemplate.queryForList(
                    "SELECT fail_count FROM login_attempts WHERE username = ?",
                    Integer.class,
                    username
            );

            return result.isEmpty() ? 0 : result.get(0);
        } catch (Exception e) {
            return 0;
        }
    }

    private void increaseFailCount(String username) {
        int current = getFailCount(username);
        int next = current + 1;

        jdbcTemplate.update(
                """
                INSERT INTO login_attempts(username, fail_count)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE fail_count = ?
                """,
                username,
                next,
                next
        );
    }

    private void resetFailCount(String username) {
        jdbcTemplate.update(
                """
                INSERT INTO login_attempts(username, fail_count)
                VALUES (?, 0)
                ON DUPLICATE KEY UPDATE fail_count = 0
                """,
                username
        );
    }
}