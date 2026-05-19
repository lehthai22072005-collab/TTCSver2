package com.ptit.demo.controller;

import com.ptit.demo.entity.Payroll;
import com.ptit.demo.entity.SystemLog;
import com.ptit.demo.entity.MonthlyBudget;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.repository.SystemLogRepository;
import com.ptit.demo.repository.MonthlyBudgetRepository;
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

    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private PayrollRepository payrollRepository;
    @Autowired private SystemLogRepository systemLogRepository;
    @Autowired private MonthlyBudgetRepository monthlyBudgetRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getAccountantStats() {
        Map<String, Object> stats = new HashMap<>();

        // 1. Tổng số nhân sự hiện có
        stats.put("totalEmployees", employeeRepository.count());

        // 2. Lấy toàn bộ chi phí lương thực tế đã chốt của các tháng (Dạng MM/YYYY)
        List<Payroll> lockedPayrolls = payrollRepository.findByTrangThaiChotTrue();
        Map<String, BigDecimal> chartMap = new HashMap<>();

        for(Payroll p : lockedPayrolls) {
            String month = p.getThangNam();
            BigDecimal currentVal = chartMap.getOrDefault(month, BigDecimal.ZERO);
            chartMap.put(month, currentVal.add(p.getThucLinh()));
        }
        stats.put("chartData", chartMap);

        // 3. Lấy toàn bộ danh sách phụ cấp dự tính của các tháng từ DB để vẽ biểu đồ
        List<MonthlyBudget> budgets = monthlyBudgetRepository.findAll();
        Map<String, BigDecimal> budgetMap = new HashMap<>();
        for(MonthlyBudget b : budgets) {
            budgetMap.put(b.getThangNam(), b.getPhuCapDuTinh());
        }
        stats.put("budgetData", budgetMap);

        // 4. Lấy thông báo hệ thống mới nhất
        List<SystemLog> logs = systemLogRepository.findAllByOrderByTimestampDesc();
        stats.put("notifications", logs.size() > 5 ? logs.subList(0, 5) : logs);

        return ResponseEntity.ok(stats);
    }
}