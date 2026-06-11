package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.TeachingDeclaration;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.TeachingDeclarationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/declarations")
@CrossOrigin("*")
public class TeachingDeclarationController {

    @Autowired
    private TeachingDeclarationRepository declarationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Lấy tất cả các bản kê khai (Dành cho HR/Trưởng khoa duyệt)
    @GetMapping
    public ResponseEntity<List<TeachingDeclaration>> getAllDeclarations() {
        return ResponseEntity.ok(declarationRepository.findAll());
    }

    // Lấy kê khai của một nhân viên (Dành cho Giảng viên xem)
    @GetMapping("/my-declarations/{employeeId}")
    public ResponseEntity<List<TeachingDeclaration>> getMyDeclarations(@PathVariable Long employeeId) {
        return ResponseEntity.ok(declarationRepository.findByEmployeeId(employeeId));
    }

    // Giảng viên gửi bản kê khai
    @PostMapping
    public ResponseEntity<?> submitDeclaration(@RequestBody Map<String, Object> payload) {
        try {
            Long employeeId = Long.parseLong(payload.get("employeeId").toString());
            String hocKy = payload.get("hocKy").toString();
            Integer soTietDay = Integer.parseInt(payload.get("soTietDay").toString());
            Integer soBaiBao = Integer.parseInt(payload.get("soBaiBao").toString());
            String ghiChu = payload.get("ghiChu") != null ? payload.get("ghiChu").toString() : "";

            if (soTietDay < 0 || soBaiBao < 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: Số tiết dạy và Số bài báo không được là số âm!"));
            }

            Employee emp = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

            TeachingDeclaration decl = new TeachingDeclaration();
            decl.setEmployee(emp);
            decl.setHocKy(hocKy);
            decl.setSoTietDay(soTietDay);
            decl.setSoBaiBao(soBaiBao);
            decl.setTrangThai("CHỜ DUYỆT");
            decl.setGhiChu(ghiChu);

            declarationRepository.save(decl);

            return ResponseEntity.ok(Map.of("message", "Gửi bản kê khai thành công!", "declaration", decl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    // HR/Trưởng khoa duyệt hoặc từ chối
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status"); // "ĐÃ DUYỆT" or "TỪ CHỐI"
            TeachingDeclaration decl = declarationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bản kê khai"));
            
            decl.setTrangThai(status);
            declarationRepository.save(decl);
            
            return ResponseEntity.ok(Map.of("message", "Đã cập nhật trạng thái thành: " + status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }
}
