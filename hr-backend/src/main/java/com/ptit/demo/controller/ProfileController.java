package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    @Autowired private AdminRepository adminRepo;
    @Autowired private AccountantRepository accountantRepo;
    @Autowired private TeacherRepository teacherRepo;
    @Autowired private DirectorRepository directorRepo;

    @GetMapping("/{role}/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String role, @PathVariable String username) {
        System.out.println("===> [API Profile] Đang tìm hồ sơ cho Role: " + role + " | Username: " + username);
        Employee emp = null;

        // Chuẩn hóa role: viết hoa toàn bộ và cắt khoảng trắng thừa
        String safeRole = role.toUpperCase().trim();

        try {
            if ("ADMIN".equals(safeRole)) {
                emp = adminRepo.findByUsername(username).map(a -> a.getEmployee()).orElse(null);
            } else if ("ACCOUNTANT".equals(safeRole)) {
                emp = accountantRepo.findByUsername(username).map(a -> a.getEmployee()).orElse(null);
            } else if ("TEACHER".equals(safeRole) || "STAFF".equals(safeRole)) {
                emp = teacherRepo.findByUsername(username).map(t -> t.getEmployee()).orElse(null);
            } else if ("DIRECTOR".equals(safeRole)) {
                emp = directorRepo.findByUsername(username).map(d -> d.getEmployee()).orElse(null);
            }
        } catch (Exception e) {
            System.out.println("===> [LỖI DB PROFILE]: " + e.getMessage());
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }

        if (emp != null) {
            System.out.println("===> [THÀNH CÔNG] Đã tìm thấy nhân sự: " + emp.getFullName());
            return ResponseEntity.ok(emp);
        }

        System.out.println("===> [THẤT BẠI] Không tìm thấy nhân sự nào khớp!");
        return ResponseEntity.status(404).body("Không tìm thấy thông tin nhân viên!");
    }
}