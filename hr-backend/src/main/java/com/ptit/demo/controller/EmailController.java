package com.ptit.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin("*")
public class EmailController {

    @PostMapping("/send-payslip")
    public ResponseEntity<?> sendPayslipEmail(@RequestBody Map<String, Object> payload) {
        // MOCK EMAIL SENDING
        Object emailObj = payload.get("email");
        String employeeEmail = (emailObj != null) ? emailObj.toString() : "unknown@example.com";
        String month = payload.getOrDefault("month", "X").toString();
        
        System.out.println("=========================================");
        System.out.println("MOCK EMAIL SENT!");
        System.out.println("To: " + employeeEmail);
        System.out.println("Subject: Phiếu lương tháng " + month);
        System.out.println("Lệnh gửi email + File đính kèm đã được thực thi thành công!");
        System.out.println("=========================================");
        
        return ResponseEntity.ok(Map.of(
            "status", "success", 
            "message", "Đã mô phỏng gửi email (Mock) tới: " + employeeEmail
        ));
    }
}
