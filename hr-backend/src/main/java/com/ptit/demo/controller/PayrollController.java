package com.ptit.demo.controller;

import com.ptit.demo.entity.Payroll;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.service.EmailService;
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

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmailService emailService;

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

        if (payrolls.isEmpty()) {
            return ResponseEntity.status(404).body("Không có dữ liệu nháp!");
        }

        payrolls.forEach(p -> {
            p.setTrangThaiChot(true);
            p.setNgayChot(LocalDateTime.now());
        });

        payrollRepository.saveAll(payrolls);

        int sentCount = 0;
        int failedCount = 0;

        if (emailService.isEmailEnabled()) {
            for (Payroll payroll : payrolls) {
                try {
                    emailService.sendPayslipEmail(payroll);
                    sentCount++;
                } catch (Exception e) {
                    failedCount++;
                    System.out.println("Lỗi gửi phiếu lương cho ID bảng lương "
                            + payroll.getId() + ": " + e.getMessage());
                }
            }
        }

        String message = "Chốt lương thành công!";

        if (emailService.isEmailEnabled()) {
            message += " Đã gửi email phiếu lương: "
                    + sentCount + " thành công, "
                    + failedCount + " thất bại.";
        } else {
            message += " Chức năng email đang tắt nên chưa gửi phiếu lương.";
        }

        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory() {
        return ResponseEntity.ok(payrollRepository.findByTrangThaiChotTrue());
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getPaymentDetail(@RequestParam String month) {
        return ResponseEntity.ok(payrollRepository.findByThangNam(month));
    }

    @GetMapping("/my-salary/{empId}")
    public ResponseEntity<?> getMySalary(@PathVariable Long empId) {
        List<Payroll> myPayrolls = payrollRepository.findByEmployeeId(empId);
        return ResponseEntity.ok(myPayrolls);
    }
}