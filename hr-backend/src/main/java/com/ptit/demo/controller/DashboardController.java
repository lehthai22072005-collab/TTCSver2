package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.KpiEvaluation;
import com.ptit.demo.entity.LeaveRequest;
import com.ptit.demo.entity.Payroll;
import com.ptit.demo.entity.RewardDiscipline;
import com.ptit.demo.entity.SystemLog;
import com.ptit.demo.entity.MonthlyBudget;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.KpiEvaluationRepository;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.repository.RewardDisciplineRepository;
import com.ptit.demo.repository.SystemLogRepository;
import com.ptit.demo.repository.MonthlyBudgetRepository;
import com.ptit.demo.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private PayrollRepository payrollRepository;
    @Autowired private SystemLogRepository systemLogRepository;
    @Autowired private MonthlyBudgetRepository monthlyBudgetRepository;
    @Autowired private LeaveRequestRepository leaveRequestRepository;
    @Autowired private KpiEvaluationRepository kpiEvaluationRepository;
    @Autowired private RewardDisciplineRepository rewardDisciplineRepository;

    // 1. API thống kê dành cho Kế toán
    @GetMapping("/stats")
    public ResponseEntity<?> getAccountantStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", employeeRepository.count());

        List<Payroll> lockedPayrolls = payrollRepository.findByTrangThaiChotTrue();
        BigDecimal totalFund03 = BigDecimal.ZERO;
        Map<String, BigDecimal> chartMap = new HashMap<>();

        for(Payroll p : lockedPayrolls) {
            if (p == null || p.getThangNam() == null) continue;
            String month = p.getThangNam();
            BigDecimal money = p.getThucLinh() != null ? p.getThucLinh() : BigDecimal.ZERO;
            chartMap.put(month, chartMap.getOrDefault(month, BigDecimal.ZERO).add(money));
            if("03/2026".equals(month)) totalFund03 = totalFund03.add(money);
        }
        stats.put("totalSalaryFund", totalFund03);
        stats.put("chartData", chartMap);

        List<MonthlyBudget> budgets = monthlyBudgetRepository.findAll();
        Map<String, BigDecimal> budgetMap = new HashMap<>();
        for(MonthlyBudget b : budgets) {
            if (b != null && b.getThangNam() != null) budgetMap.put(b.getThangNam(), b.getPhuCapDuTinh());
        }
        stats.put("budgetData", budgetMap);

        List<SystemLog> logs = systemLogRepository.findAllByOrderByIdDesc();
        stats.put("notifications", logs.size() > 5 ? logs.subList(0, 5) : logs);
        return ResponseEntity.ok(stats);
    }

    // 2. API thống kê tổng quan dành cho BGH
    @GetMapping("/director-stats")
    public ResponseEntity<?> getDirectorStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("totalEmployees", employeeRepository.count());
            long pendingLeaves = leaveRequestRepository.findAll().stream()
                    .filter(req -> req != null && "Chờ duyệt".equals(req.getStatus())).count();
            stats.put("pendingLeaves", pendingLeaves);

            List<Payroll> lockedPayrolls = payrollRepository.findByTrangThaiChotTrue();
            Map<String, BigDecimal> trendMap = new HashMap<>();
            BigDecimal totalAnnualFund = BigDecimal.ZERO;

            for(Payroll p : lockedPayrolls) {
                if (p == null || p.getThangNam() == null) continue;
                String month = p.getThangNam();
                BigDecimal money = p.getThucLinh() != null ? p.getThucLinh() : BigDecimal.ZERO;
                trendMap.put(month, trendMap.getOrDefault(month, BigDecimal.ZERO).add(money));
                totalAnnualFund = totalAnnualFund.add(money);
            }
            stats.put("monthlyTrend", trendMap);
            stats.put("totalSalaryFund", totalAnnualFund);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    // 3. API báo cáo nhân sự chuyên sâu
    @GetMapping("/hr-reports")
    public ResponseEntity<?> getHrReports() {
        Map<String, Object> response = new HashMap<>();
        List<Employee> employees = employeeRepository.findAll();

        Map<String, Long> deptStats = employees.stream()
                .collect(Collectors.groupingBy(
                        emp -> (emp.getDepartment() != null && !emp.getDepartment().trim().isEmpty())
                                ? emp.getDepartment() : "Chưa phân bổ",
                        Collectors.counting()
                ));
        response.put("departmentDistribution", deptStats);

        List<Map<String, Object>> recentChanges = employees.stream()
                .sorted((e1, e2) -> e2.getId().compareTo(e1.getId()))
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", "NV" + e.getId());
                    map.put("fullName", e.getFullName());
                    map.put("department", e.getDepartment());
                    map.put("academicDegree", e.getAcademicDegree());

                    String status = "Đang làm việc";
                    if (e.getContractEndDate() != null && e.getContractEndDate().isBefore(java.time.LocalDate.now())) {
                        status = "Hết hạn HĐ";
                    }
                    map.put("status", status);
                    return map;
                })
                .collect(Collectors.toList());
        response.put("recentChanges", recentChanges);

        List<Map<String, Object>> turnoverTrends = new java.util.ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", "Tháng " + i);
            monthData.put("tuyenMoi", 0L);
            monthData.put("thoiViec", 0L);
            turnoverTrends.add(monthData);
        }

        int currentYear = 2026;
        for (Employee emp : employees) {
            if (emp.getContractStartDate() != null && emp.getContractStartDate().getYear() == currentYear) {
                int monthIndex = emp.getContractStartDate().getMonthValue() - 1;
                long currentTuyenMoi = (long) turnoverTrends.get(monthIndex).get("tuyenMoi");
                turnoverTrends.get(monthIndex).put("tuyenMoi", currentTuyenMoi + 1);
            }
            if (emp.getContractEndDate() != null && emp.getContractEndDate().getYear() == currentYear
                    && emp.getContractEndDate().isBefore(java.time.LocalDate.now())) {
                int monthIndex = emp.getContractEndDate().getMonthValue() - 1;
                long currentThoiViec = (long) turnoverTrends.get(monthIndex).get("thoiViec");
                turnoverTrends.get(monthIndex).put("thoiViec", currentThoiViec + 1);
            }
        }
        response.put("turnoverTrends", turnoverTrends);
        return ResponseEntity.ok(response);
    }

    // 4. API MỚI: PHÂN TÍCH BIẾN ĐỘNG QUỸ LƯƠNG ĐỘNG LẬP 12 THÁNG (Cho tab Biến động quỹ lương)
    @GetMapping("/salary-fluctuations")
    public ResponseEntity<?> getSalaryFluctuations() {
        List<Payroll> lockedPayrolls = payrollRepository.findByTrangThaiChotTrue();

        // Tính tổng quỹ lương thực tế gom nhóm theo từng kỳ tháng "MM/2026"
        Map<String, BigDecimal> monthlySum = new HashMap<>();
        for (Payroll p : lockedPayrolls) {
            if (p == null || p.getThangNam() == null) continue;
            BigDecimal money = p.getThucLinh() != null ? p.getThucLinh() : BigDecimal.ZERO;
            monthlySum.put(p.getThangNam(), monthlySum.getOrDefault(p.getThangNam(), BigDecimal.ZERO).add(money));
        }

        List<Map<String, Object>> resultList = new ArrayList<>();
        BigDecimal previousMonthFund = BigDecimal.ZERO;

        // Chạy vòng lặp cơ học quét qua trọn vẹn 12 tháng năm 2026
        for (int i = 1; i <= 12; i++) {
            String monthKey = String.format("%02d/2026", i);
            BigDecimal currentMonthFund = monthlySum.getOrDefault(monthKey, BigDecimal.ZERO);

            Map<String, Object> row = new HashMap<>();

            // ĐÃ FIX LỖI "Cannot resolve method 'add' in 'Map'" -> Sử dụng put() thay cho add()
            row.put("month", "Tháng " + i + " (" + monthKey + ")");
            row.put("totalFund", currentMonthFund);

            // Thuật toán so sánh tìm mức độ tăng trưởng liên kỳ
            if (i == 1) {
                row.put("changeValue", BigDecimal.ZERO);
                row.put("changePercentage", 0.0);
                row.put("status", "Ổn định");
            } else {
                BigDecimal changeValue = currentMonthFund.subtract(previousMonthFund);
                row.put("changeValue", changeValue);

                double percent = 0.0;
                if (previousMonthFund.compareTo(BigDecimal.ZERO) > 0) {
                    percent = changeValue.multiply(new BigDecimal("100"))
                            .divide(previousMonthFund, 2, RoundingMode.HALF_UP).doubleValue();
                } else if (currentMonthFund.compareTo(BigDecimal.ZERO) > 0) {
                    percent = 100.0; // Nếu tháng trước bằng 0, tháng này nảy số tính tăng 100%
                }
                row.put("changePercentage", percent);

                if (changeValue.compareTo(BigDecimal.ZERO) > 0) {
                    row.put("status", "Tăng");
                } else if (changeValue.compareTo(BigDecimal.ZERO) < 0) {
                    row.put("status", "Giảm");
                } else {
                    row.put("status", "Ổn định");
                }
            }

            resultList.add(row);
            previousMonthFund = currentMonthFund; // Gán giữ chỗ dòng tiền phục vụ so sánh tháng sau
        }

        return ResponseEntity.ok(resultList);
    }

    @GetMapping("/hr-overview-report")
    public ResponseEntity<?> getHrOverviewReport() {
        LocalDate today = LocalDate.now();
        LocalDate expiringLimit = today.plusDays(60);
        int currentYear = Year.now().getValue();

        List<Employee> employees = employeeRepository.findAll();
        List<Payroll> lockedPayrolls = payrollRepository.findByTrangThaiChotTrue();
        List<KpiEvaluation> kpis = kpiEvaluationRepository.findAll();
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();
        List<RewardDiscipline> rewardDisciplines = rewardDisciplineRepository.findAll();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("generatedAt", java.time.LocalDateTime.now().toString());

        Map<String, Long> departmentDistribution = employees.stream()
                .collect(Collectors.groupingBy(
                        emp -> hasText(emp.getDepartment()) ? emp.getDepartment() : "Chưa phân bổ",
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        Map<String, Object> personnelOverview = new LinkedHashMap<>();
        personnelOverview.put("totalEmployees", employees.size());
        personnelOverview.put("departmentDistribution", departmentDistribution);
        response.put("personnelOverview", personnelOverview);

        long expiredContracts = employees.stream()
                .filter(emp -> emp.getContractEndDate() != null && emp.getContractEndDate().isBefore(today))
                .count();
        long expiringContracts = employees.stream()
                .filter(emp -> emp.getContractEndDate() != null
                        && !emp.getContractEndDate().isBefore(today)
                        && !emp.getContractEndDate().isAfter(expiringLimit))
                .count();
        long activeContracts = employees.size() - expiredContracts - expiringContracts;

        Map<String, Object> contractSituation = new LinkedHashMap<>();
        contractSituation.put("active", activeContracts);
        contractSituation.put("expiringSoon", expiringContracts);
        contractSituation.put("expired", expiredContracts);
        contractSituation.put("expiringWindowDays", 60);
        response.put("contractSituation", contractSituation);

        Map<String, BigDecimal> salaryByMonth = lockedPayrolls.stream()
                .filter(p -> p != null && hasText(p.getThangNam()))
                .collect(Collectors.groupingBy(
                        Payroll::getThangNam,
                        Collectors.reducing(BigDecimal.ZERO,
                                p -> p.getThucLinh() != null ? p.getThucLinh() : BigDecimal.ZERO,
                                BigDecimal::add)
                ));

        List<String> sortedSalaryMonths = salaryByMonth.keySet().stream()
                .sorted(Comparator.comparing(this::parseMonthKey))
                .collect(Collectors.toList());

        String latestMonth = sortedSalaryMonths.isEmpty() ? null : sortedSalaryMonths.get(sortedSalaryMonths.size() - 1);
        BigDecimal latestNetSalary = latestMonth == null ? BigDecimal.ZERO : salaryByMonth.getOrDefault(latestMonth, BigDecimal.ZERO);
        List<Map<String, Object>> salaryTrend = sortedSalaryMonths.stream()
                .skip(Math.max(0, sortedSalaryMonths.size() - 6))
                .map(month -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("month", month);
                    item.put("totalNetSalary", salaryByMonth.getOrDefault(month, BigDecimal.ZERO));
                    return item;
                })
                .collect(Collectors.toList());

        Map<String, Object> salaryFund = new LinkedHashMap<>();
        salaryFund.put("latestMonth", latestMonth);
        salaryFund.put("latestTotalNetSalary", latestNetSalary);
        salaryFund.put("sixMonthTrend", salaryTrend);
        response.put("salaryFund", salaryFund);

        Map<String, Long> kpiDistribution = new LinkedHashMap<>();
        kpiDistribution.put("Xuất sắc", 0L);
        kpiDistribution.put("Tốt", 0L);
        kpiDistribution.put("Đạt", 0L);
        kpiDistribution.put("Không đạt", 0L);
        for (KpiEvaluation kpi : kpis) {
            String bucket = classifyKpi(kpi);
            kpiDistribution.put(bucket, kpiDistribution.get(bucket) + 1);
        }
        Map<String, Object> kpiReport = new LinkedHashMap<>();
        kpiReport.put("totalEvaluations", kpis.size());
        kpiReport.put("distribution", kpiDistribution);
        response.put("kpiReport", kpiReport);

        long pendingLeaves = leaveRequests.stream().filter(req -> isPendingStatus(req.getStatus())).count();
        long approvedLeaves = leaveRequests.stream().filter(req -> isApprovedStatus(req.getStatus())).count();
        Map<String, Object> leaveSituation = new LinkedHashMap<>();
        leaveSituation.put("pending", pendingLeaves);
        leaveSituation.put("approved", approvedLeaves);
        leaveSituation.put("totalRequests", leaveRequests.size());
        response.put("leaveSituation", leaveSituation);

        long rewardCount = rewardDisciplines.stream()
                .filter(rd -> rd.getEffectiveDate() != null && rd.getEffectiveDate().getYear() == currentYear)
                .filter(rd -> "KHEN_THUONG".equalsIgnoreCase(rd.getType()))
                .count();
        long disciplineCount = rewardDisciplines.stream()
                .filter(rd -> rd.getEffectiveDate() != null && rd.getEffectiveDate().getYear() == currentYear)
                .filter(rd -> "KY_LUAT".equalsIgnoreCase(rd.getType()))
                .count();
        Map<String, Object> rewardDisciplineReport = new LinkedHashMap<>();
        rewardDisciplineReport.put("year", currentYear);
        rewardDisciplineReport.put("rewardCount", rewardCount);
        rewardDisciplineReport.put("disciplineCount", disciplineCount);
        response.put("rewardDisciplineReport", rewardDisciplineReport);

        return ResponseEntity.ok(response);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private YearMonth parseMonthKey(String month) {
        try {
            return YearMonth.parse(month, DateTimeFormatter.ofPattern("MM/yyyy"));
        } catch (Exception e) {
            return YearMonth.of(1900, 1);
        }
    }

    private String classifyKpi(KpiEvaluation kpi) {
        String raw = kpi.getXepLoai();
        if (hasText(raw)) {
            String normalized = raw.trim().toLowerCase();
            if (normalized.contains("xuất") || normalized.contains("xuat")) return "Xuất sắc";
            if (normalized.contains("tốt") || normalized.contains("tot")) return "Tốt";
            if (normalized.contains("không") || normalized.contains("khong") || normalized.contains("chưa") || normalized.contains("chua")) return "Không đạt";
            if (normalized.contains("đạt") || normalized.contains("dat") || normalized.contains("hoàn thành")) return "Đạt";
            return "Không đạt";
        }

        if (kpi.getDiemDanhGia() == null) return "Không đạt";
        if (kpi.getDiemDanhGia().compareTo(new BigDecimal("8.5")) >= 0) return "Xuất sắc";
        if (kpi.getDiemDanhGia().compareTo(new BigDecimal("7.0")) >= 0) return "Tốt";
        if (kpi.getDiemDanhGia().compareTo(new BigDecimal("5.0")) >= 0) return "Đạt";
        return "Không đạt";
    }

    private boolean isPendingStatus(String status) {
        if (!hasText(status)) return false;
        String normalized = status.trim().toLowerCase();
        return normalized.contains("chờ") || normalized.contains("cho") || normalized.contains("pending");
    }

    private boolean isApprovedStatus(String status) {
        if (!hasText(status)) return false;
        String normalized = status.trim().toLowerCase();
        return normalized.contains("duyệt") || normalized.contains("duyet") || normalized.contains("approved");
    }
}
