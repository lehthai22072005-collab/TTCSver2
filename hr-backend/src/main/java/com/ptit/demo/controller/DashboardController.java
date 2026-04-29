package com.ptit.demo.controller;

import com.ptit.demo.entity.Payroll;
import com.ptit.demo.entity.SystemLog;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private SystemLogRepository systemLogRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        // 1. Đếm tổng nhân sự
        long totalEmployees = employeeRepository.count();

        // 2. Tính quỹ lương tháng 03/2026
        List<Payroll> allPayrolls = payrollRepository.findAll();
        BigDecimal totalSalaryFund = allPayrolls.stream()
                .filter(p -> "03/2026".equals(p.getThangNam()))
                .map(Payroll::getThucLinh)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Dữ liệu biểu đồ 3 tháng
        Map<String, BigDecimal> chartDataMap = new HashMap<>();
        String[] months = {"01/2026", "02/2026", "03/2026"};
        for (String m : months) {
            BigDecimal sum = allPayrolls.stream()
                    .filter(p -> m.equals(p.getThangNam()))
                    .map(Payroll::getThucLinh)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            chartDataMap.put(m, sum);
        }

        // 4. Lấy danh sách thông báo thực tế từ bảng system_logs
        List<SystemLog> notifications = systemLogRepository.findAllByOrderByTimestampDesc();

        Map<String, Object> response = new HashMap<>();
        response.put("totalEmployees", totalEmployees);
        response.put("totalSalaryFund", totalSalaryFund);
        response.put("chartData", chartDataMap);
        response.put("notifications", notifications); // Gửi list log về cho React

        return ResponseEntity.ok(response);
    }
}