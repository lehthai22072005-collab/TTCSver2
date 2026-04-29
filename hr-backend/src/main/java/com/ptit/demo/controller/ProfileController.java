package com.ptit.demo.controller;

import com.ptit.demo.entity.Accountant;
import com.ptit.demo.entity.Employee;
import com.ptit.demo.repository.AccountantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    @Autowired
    private AccountantRepository accountantRepository;

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        // SỬA LỖI: Sử dụng .orElse(null) để khớp kiểu dữ liệu Accountant
        Accountant acc = accountantRepository.findByUsername(username).orElse(null);

        // Kiểm tra nếu tài khoản tồn tại và có gắn với nhân viên
        if (acc != null && acc.getEmployee() != null) {
            Employee emp = acc.getEmployee();
            return ResponseEntity.ok(emp);
        }

        return ResponseEntity.status(404).body("Không tìm thấy thông tin tài khoản: " + username);
    }
}