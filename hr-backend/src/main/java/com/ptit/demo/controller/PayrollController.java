package com.ptit.demo.controller;

import com.ptit.demo.entity.Payroll;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salary")
@CrossOrigin("*")
public class PayrollController {

    @Autowired private PayrollService payrollService;
    @Autowired private PayrollRepository payrollRepository;
    @Autowired private EmployeeRepository employeeRepository;

    @GetMapping("/preview")
    public ResponseEntity<?> previewSalary(@RequestParam String month) {
        if (payrollRepository.existsByThangNamAndTrangThaiChotTrue(month)) {
            return ResponseEntity.badRequest().body("Tháng " + month + " đã được chốt lương. Không thể tính lại!");
        }

        try {
            var employees = employeeRepository.findAll();
            List<Payroll> payrollList = payrollService.calculateForAll(month, employees);
            payrollRepository.deleteByThangNamAndTrangThaiChotFalse(month);
            payrollRepository.saveAll(payrollList);
            return ResponseEntity.ok(payrollList);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/lock")
    public ResponseEntity<?> lockSalary(@RequestParam String month) {
        if (payrollRepository.existsByThangNamAndTrangThaiChotTrue(month)) {
            return ResponseEntity.badRequest().body("Tháng " + month + " đã chốt rồi!");
        }
        List<Payroll> payrolls = payrollRepository.findByThangNam(month);
        if (payrolls.isEmpty()) return ResponseEntity.status(404).body("Không có dữ liệu nháp!");

        payrolls.forEach(p -> {
            p.setTrangThaiChot(true);
            p.setNgayChot(LocalDateTime.now());
        });
        payrollRepository.saveAll(payrolls);
        return ResponseEntity.ok(Map.of("message", "Chốt lương thành công!"));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory() {
        return ResponseEntity.ok(payrollRepository.findByTrangThaiChotTrue());
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getPaymentDetail(@RequestParam String month) {
        return ResponseEntity.ok(payrollRepository.findByThangNam(month));
    }

    // THÊM MỚI: API cho trang Phiếu lương của cá nhân (Giảng viên/Nhân viên)
    @GetMapping("/my-salary/{empId}")
    public ResponseEntity<?> getMySalary(@PathVariable Long empId) {
        List<Payroll> myPayrolls = payrollRepository.findByEmployeeId(empId);
        return ResponseEntity.ok(myPayrolls);
    }
}