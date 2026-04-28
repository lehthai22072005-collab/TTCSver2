package com.ptit.demo.controller;

import com.ptit.demo.dto.LoginRequest;
import com.ptit.demo.dto.LoginResponse;
import com.ptit.demo.entity.*;
import com.ptit.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        // 1. Check Admin
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            Admin admin = adminOpt.get();
            return ResponseEntity.ok(new LoginResponse(
                    true, "Đăng nhập thành công", "ADMIN",
                    admin.getEmployee() != null ? admin.getEmployee().getId() : null,
                    admin.getEmployee() != null ? admin.getEmployee().getFullName() : "Admin"
            ));
        }

        // 2. Check Teacher/Staff (SỬA TẠI ĐÂY)
        Optional<Teacher> teacherOpt = teacherRepository.findByUsername(username);
        if (teacherOpt.isPresent() && teacherOpt.get().getPassword().equals(password)) {
            Teacher staffAccount = teacherOpt.get();
            String finalRole = "STAFF"; // Mặc định là nhân viên bình thường (Bảo vệ, Lao công...)

            // Kiểm tra nếu có thông tin nhân viên và chức vụ là "Giảng viên"
            if (staffAccount.getEmployee() != null &&
                    "Giảng viên".equalsIgnoreCase(staffAccount.getEmployee().getPosition())) {
                finalRole = "TEACHER";
            }

            return ResponseEntity.ok(new LoginResponse(
                    true, "Đăng nhập thành công", finalRole,
                    staffAccount.getEmployee() != null ? staffAccount.getEmployee().getId() : null,
                    staffAccount.getEmployee() != null ? staffAccount.getEmployee().getFullName() : "Nhân sự"
            ));
        }

        // 3. Check Accountant
        Optional<Accountant> accountantOpt = accountantRepository.findByUsername(username);
        if (accountantOpt.isPresent() && accountantOpt.get().getPassword().equals(password)) {
            Accountant accountant = accountantOpt.get();
            return ResponseEntity.ok(new LoginResponse(
                    true, "Đăng nhập thành công", "ACCOUNTANT",
                    accountant.getEmployee() != null ? accountant.getEmployee().getId() : null,
                    accountant.getEmployee() != null ? accountant.getEmployee().getFullName() : "Kế toán"
            ));
        }

        // 4. Check Director
        Optional<Director> directorOpt = directorRepository.findByUsername(username);
        if (directorOpt.isPresent() && directorOpt.get().getPassword().equals(password)) {
            Director director = directorOpt.get();
            return ResponseEntity.ok(new LoginResponse(
                    true, "Đăng nhập thành công", "DIRECTOR",
                    director.getEmployee() != null ? director.getEmployee().getId() : null,
                    director.getEmployee() != null ? director.getEmployee().getFullName() : "Ban Giám Hiệu"
            ));
        }

        return ResponseEntity.badRequest().body(
                new LoginResponse(false, "Sai tên username hoặc password", null, null, null)
        );
    }
}