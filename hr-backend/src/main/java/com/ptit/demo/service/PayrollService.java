package com.ptit.demo.service;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.Payroll;
import com.ptit.demo.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

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
        BigDecimal pricePerPeriod = new BigDecimal("150000");

        // Chuyển MM/YYYY -> YYYY-MM-% để query LIKE trong SQL
        String[] parts = month.split("/");
        String monthPattern = parts[1] + "-" + parts[0] + "-%";

        for (Employee emp : employees) {
            // Lấy dữ liệu chấm công thực tế
            int workDays = payrollRepository.countWorkDays(emp.getId(), monthPattern);
            Integer totalPeriods = payrollRepository.sumTeachingPeriods(emp.getId(), monthPattern);
            int periods = (totalPeriods != null) ? totalPeriods : 0;

            // BƯỚC CHẶN: Nếu nhân viên không có bất kỳ ngày công hay tiết dạy nào thì không tạo lương
            if (workDays == 0 && periods == 0) {
                continue;
            }

            Payroll p = new Payroll();
            p.setEmployee(emp);
            p.setThangNam(month);
            p.setTrangThaiChot(false);

            BigDecimal actualBaseSalary = (emp.getBaseSalary() != null) ? emp.getBaseSalary() : new BigDecimal("10000000");
            BigDecimal net = calculateNetSalary(actualBaseSalary, periods, pricePerPeriod);

            p.setLuongCoBan(actualBaseSalary);
            p.setThucLinh(net);
            p.setNgayCong(workDays);
            p.setTietDay(periods);

            payrollList.add(p);
        }

        // Nếu cả danh sách trống (không ai có chấm công)
        if (payrollList.isEmpty()) {
            throw new RuntimeException("Dữ liệu chấm công tháng " + month + " trống. Không thể tính lương!");
        }

        return payrollList;
    }
}