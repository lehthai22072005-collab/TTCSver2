package com.ptit.demo.controller;

import com.ptit.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin("*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/test")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> payload) {
        try {
            String toEmail = payload.get("toEmail");

            if (toEmail == null || toEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Vui lòng nhập email nhận thử!"
                ));
            }

            String result = emailService.sendTestEmail(toEmail);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", result
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}