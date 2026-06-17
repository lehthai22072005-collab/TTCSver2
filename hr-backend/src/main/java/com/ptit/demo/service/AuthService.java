package com.ptit.demo.service;

import com.ptit.demo.dto.LoginRequest;
import com.ptit.demo.dto.LoginResponse;
import com.ptit.demo.entity.Accountant;
import com.ptit.demo.entity.Admin;
import com.ptit.demo.entity.Director;
import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.Hr;
import com.ptit.demo.entity.LoginAttempt;
import com.ptit.demo.entity.Teacher;
import com.ptit.demo.repository.AccountantRepository;
import com.ptit.demo.repository.AdminRepository;
import com.ptit.demo.repository.DirectorRepository;
import com.ptit.demo.repository.HrRepository;
import com.ptit.demo.repository.LoginAttemptRepository;
import com.ptit.demo.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

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
    private LoginAttemptRepository loginAttemptRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SystemLogService systemLogService;

    public LoginResponse login(String username, String password) {
        if (isAccountLockedInDatabase(username)) {
            systemLogService.log("Đăng nhập thất bại: tài khoản đang bị khóa", username);
            return loginFailed("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
        }

        boolean maintenanceMode = configService.getBoolean("maintenanceMode", false);
        int maxLoginAttempts = configService.getInt("maxLoginAttempts", 5);

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            Admin admin = adminOpt.get();
            return successfulLogin(username, "ADMIN", admin.getEmployee(), "Admin");
        }

        if (maintenanceMode) {
            systemLogService.log("Đăng nhập bị từ chối do hệ thống bảo trì", username);
            return new LoginResponse(
                    false,
                    "Hệ thống đang bảo trì. Chỉ Admin được phép đăng nhập.",
                    null,
                    null,
                    null
            );
        }

        int currentFailCount = getFailCount(username);
        if (currentFailCount >= maxLoginAttempts) {
            lockAccountInDatabase(username);
            systemLogService.log("Tài khoản bị khóa do đăng nhập sai quá số lần cho phép", username);
            return loginFailed("Tài khoản đã bị khóa do nhập sai quá " + maxLoginAttempts + " lần.");
        }

        Optional<Teacher> teacherOpt = teacherRepository.findByUsername(username);
        if (teacherOpt.isPresent() && teacherOpt.get().getPassword().equals(password)) {
            Teacher staffAccount = teacherOpt.get();
            String finalRole = "STAFF";
            Employee employee = staffAccount.getEmployee();

            if (employee != null && isTeacherGroup(employee.getNhomNhanSu())) {
                finalRole = "TEACHER";
            }

            return successfulLogin(username, finalRole, employee, "Nhân sự");
        }

        Optional<Accountant> accountantOpt = accountantRepository.findByUsername(username);
        if (accountantOpt.isPresent() && accountantOpt.get().getPassword().equals(password)) {
            Accountant accountant = accountantOpt.get();
            return successfulLogin(username, "ACCOUNTANT", accountant.getEmployee(), "Kế toán");
        }

        Optional<Director> directorOpt = directorRepository.findByUsername(username);
        if (directorOpt.isPresent() && directorOpt.get().getPassword().equals(password)) {
            Director director = directorOpt.get();
            return successfulLogin(username, "DIRECTOR", director.getEmployee(), "Ban Giám Hiệu");
        }

        Optional<Hr> hrOpt = hrRepository.findByUsername(username);
        if (hrOpt.isPresent() && hrOpt.get().getPassword().equals(password)) {
            Hr hr = hrOpt.get();
            return successfulLogin(username, "HR", hr.getEmployee(), "Phòng nhân sự");
        }

        increaseFailCount(username);

        int afterFailCount = getFailCount(username);
        if (afterFailCount >= maxLoginAttempts) {
            lockAccountInDatabase(username);
            systemLogService.log("Tài khoản bị khóa do đăng nhập sai quá số lần cho phép", username);
            return loginFailed("Tài khoản đã bị khóa do nhập sai quá " + maxLoginAttempts + " lần.");
        }

        systemLogService.log("Đăng nhập thất bại", username);
        return loginFailed("Sai username hoặc password. Số lần sai: " + afterFailCount + "/" + maxLoginAttempts);
    }

    private LoginResponse successfulLogin(String username, String role, Employee employee, String fallbackName) {
        LoginResponse expiredResponse = rejectIfContractExpired(employee, username);
        if (expiredResponse != null) {
            return expiredResponse;
        }

        resetFailCount(username);
        systemLogService.log("Đăng nhập thành công", username);

        return new LoginResponse(
                true,
                "Đăng nhập thành công",
                role,
                employee != null ? employee.getId() : null,
                employee != null ? employee.getFullName() : fallbackName
        );
    }

    private LoginResponse rejectIfContractExpired(Employee employee, String username) {
        if (employee == null || employee.getContractEndDate() == null) {
            return null;
        }

        if (!employee.getContractEndDate().isBefore(LocalDate.now())) {
            return null;
        }

        systemLogService.log("Đăng nhập thất bại: hợp đồng đã hết hạn", username);
        return loginFailed(
                "Hợp đồng của tài khoản này đã hết hạn. Vui lòng liên hệ Phòng nhân sự.",
                employee.getId(),
                employee.getFullName()
        );
    }

    private LoginResponse loginFailed(String message) {
        return loginFailed(message, null, null);
    }

    private LoginResponse loginFailed(String message, Long employeeId, String fullName) {
        return new LoginResponse(
                false,
                message,
                null,
                employeeId,
                fullName
        );
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
                // Ignore missing/temporary table issues during startup.
            }
        }
        return false;
    }

    private boolean isTeacherGroup(String group) {
        if (group == null) {
            return false;
        }
        String normalized = group.trim().toLowerCase();
        return normalized.equals("giảng viên")
                || normalized.equals("giang vien")
                || normalized.contains("giảng")
                || normalized.contains("giang");
    }

    private void lockAccountInDatabase(String username) {
        String[] tables = {"admin", "staff", "accountant", "ban_giam_hieu", "human_resources"};
        for (String table : tables) {
            try {
                jdbcTemplate.update("UPDATE " + table + " SET status = 'Locked' WHERE username = ?", username);
            } catch (Exception e) {
                // Ignore missing/temporary table issues during startup.
            }
        }
    }

    private int getFailCount(String username) {
        return loginAttemptRepository.findByUsername(username)
                .map(LoginAttempt::getFailCount)
                .orElse(0);
    }

    private void increaseFailCount(String username) {
        LoginAttempt attempt = loginAttemptRepository.findByUsername(username)
                .orElse(new LoginAttempt(username, 0));
        attempt.setFailCount(attempt.getFailCount() + 1);
        loginAttemptRepository.save(attempt);
    }

    private void resetFailCount(String username) {
        loginAttemptRepository.findByUsername(username).ifPresent(attempt -> {
            attempt.setFailCount(0);
            loginAttemptRepository.save(attempt);
        });
    }
}
