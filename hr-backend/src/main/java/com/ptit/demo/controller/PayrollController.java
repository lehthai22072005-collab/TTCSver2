package com.ptit.demo.controller;

import com.ptit.demo.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin("*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @PostMapping("/calculate")
    public ResponseEntity<?> previewSalary(@RequestBody Map<String, Object> data) {
        // Lấy dữ liệu từ request (giả lập từ giao diện gửi lên)
        BigDecimal base = new BigDecimal(data.get("baseSalary").toString());
        int periods = (int) data.get("periods");
        BigDecimal price = new BigDecimal("150000"); // Đơn giá mỗi tiết dạy

        BigDecimal net = payrollService.calculateNetSalary(base, periods, price);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "netSalary", net,
                "message", "Tính toán lương nháp thành công (UC-005)"
        ));
    }
}