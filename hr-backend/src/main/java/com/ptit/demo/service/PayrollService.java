package com.ptit.demo.service;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.Payroll;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("SpellCheckingInspection") // Tắt cảnh báo typo tiếng Việt
public class PayrollService {
    private static final BigDecimal BHXH_RATE = new BigDecimal("0.105");
    private static final BigDecimal TAX_FREE_THRESHOLD = new BigDecimal("11000000");

    public BigDecimal calculateNetSalary(BigDecimal baseSalary, int totalPeriods, BigDecimal pricePerPeriod) {
        BigDecimal teachingAllowance = pricePerPeriod.multiply(new BigDecimal(totalPeriods));
        BigDecimal insuranceDeduction = baseSalary.multiply(BHXH_RATE);
        BigDecimal grossIncome = baseSalary.add(teachingAllowance);
        BigDecimal taxableIncome = grossIncome.subtract(TAX_FREE_THRESHOLD).subtract(insuranceDeduction);

        BigDecimal personalTax = BigDecimal.ZERO;
        if (taxableIncome.compareTo(BigDecimal.ZERO) > 0) {
            personalTax = taxableIncome.multiply(new BigDecimal("0.05"));
        }
        return grossIncome.subtract(insuranceDeduction).subtract(personalTax).setScale(0, RoundingMode.HALF_UP);
    }

    public List<Payroll> calculateForAll(String month, List<Employee> employees) {
        List<Payroll> payrollList = new ArrayList<>();
        BigDecimal defaultBaseSalary = new BigDecimal("10000000");
        BigDecimal pricePerPeriod = new BigDecimal("150000");

        for (Employee emp : employees) {
            Payroll p = new Payroll();
            p.setEmployee(emp);
            p.setThangNam(month);
            p.setTrangThaiChot(false);

            // Giả lập số liệu khớp với tài liệu thiết kế của bạn
            int workDays = (emp.getId() != null && emp.getId() == 1) ? 26 : 24;
            int periods = (emp.getId() != null && emp.getId() == 1) ? 40 : 35;

            BigDecimal net = calculateNetSalary(defaultBaseSalary, periods, pricePerPeriod);

            p.setLuongCoBan(defaultBaseSalary);
            p.setThucLinh(net);
            p.setNgayCong(workDays); // Đã hết lỗi setNgayCong
            p.setTietDay(periods);   // Đã hết lỗi setTietDay

            payrollList.add(p);
        }
        return payrollList;
    }
}