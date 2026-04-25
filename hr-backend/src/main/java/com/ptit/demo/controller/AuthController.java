package com.ptit.demo.controller;

import com.ptit.demo.dto.LoginRequest;
import com.ptit.demo.dto.LoginResponse;
import com.ptit.demo.entity.Admin;
import com.ptit.demo.entity.Accountant;
import com.ptit.demo.entity.Teacher;
import com.ptit.demo.repository.AdminRepository;
import com.ptit.demo.repository.AccountantRepository;
import com.ptit.demo.repository.TeacherRepository;
import com.ptit.demo.entity.Director;
import com.ptit.demo.repository.DirectorRepository;
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

        // Admin check
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            Admin admin = adminOpt.get();
            return ResponseEntity.ok(new LoginResponse(
                true, "Đăng nhập thành công", "ADMIN", 
                admin.getEmployee() != null ? admin.getEmployee().getId() : null,
                admin.getEmployee() != null ? admin.getEmployee().getFullName() : null
            ));
        }


        // Teacher check
        Optional<Teacher> teacherOpt = teacherRepository.findByUsername(username);
        if (teacherOpt.isPresent() && teacherOpt.get().getPassword().equals(password)) {
            Teacher teacher = teacherOpt.get();
            return ResponseEntity.ok(new LoginResponse(
                true, "Đăng nhập thành công", "TEACHER", 
                teacher.getEmployee() != null ? teacher.getEmployee().getId() : null,
                teacher.getEmployee() != null ? teacher.getEmployee().getFullName() : null
            ));
        }

        // Accountant check
        Optional<Accountant> accountantOpt = accountantRepository.findByUsername(username);
        if (accountantOpt.isPresent() && accountantOpt.get().getPassword().equals(password)) {
            Accountant accountant = accountantOpt.get();
            return ResponseEntity.ok(new LoginResponse(
                true, "Đăng nhập thành công", "ACCOUNTANT", 
                accountant.getEmployee() != null ? accountant.getEmployee().getId() : null,
                accountant.getEmployee() != null ? accountant.getEmployee().getFullName() : null
            ));
        }

        // Director check
        Optional<Director> directorOpt = directorRepository.findByUsername(username);
        if (directorOpt.isPresent() && directorOpt.get().getPassword().equals(password)) {
            Director director = directorOpt.get();
            return ResponseEntity.ok(new LoginResponse(
                true, "Đăng nhập thành công", "DIRECTOR", 
                null, // Director doesn't link to Employee table in current schema directly
                "Ban Giám Hiệu"
            ));
        }

        return ResponseEntity.badRequest().body(
            new LoginResponse(false, "sai tên username hoặc password", null, null, null)
        );
    }
}
