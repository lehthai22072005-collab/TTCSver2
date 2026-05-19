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

    public List<Payroll> calculateForAll(String month, List<Employee> employees) {
        List<Payroll> payrollList = new ArrayList<>();
        BigDecimal pricePerPeriod = new BigDecimal("150000");

        String[] parts = month.split("/");
        String monthPattern = parts[1] + "-" + parts[0] + "-%";

        for (Employee emp : employees) {
            int workDays = payrollRepository.countWorkDays(emp.getId(), monthPattern);
            Integer totalPeriods = payrollRepository.sumTeachingPeriods(emp.getId(), monthPattern);
            int periods = (totalPeriods != null) ? totalPeriods : 0;

            if (workDays == 0 && periods == 0) {
                continue;
            }

            Payroll p = new Payroll();
            p.setEmployee(emp);
            p.setThangNam(month);
            p.setTrangThaiChot(false);
            p.setNgayCong(workDays);
            p.setTietDay(periods);

            BigDecimal baseSalary = (emp.getBaseSalary() != null) ? emp.getBaseSalary() : new BigDecimal("10000000");

            // 1. Tính phụ cấp đứng lớp (số tiết * 150.000đ)
            BigDecimal teachingAllowance = pricePerPeriod.multiply(new BigDecimal(periods));

            // 2. Tính khấu trừ bảo hiểm xã hội (10.5% lương cơ bản)
            BigDecimal insuranceDeduction = baseSalary.multiply(BHXH_RATE).setScale(0, RoundingMode.HALF_UP);

            // 3. Tính thuế thu nhập cá nhân (5% phần thu nhập tính thuế vượt ngưỡng 11 triệu)
            BigDecimal grossIncome = baseSalary.add(teachingAllowance);
            BigDecimal taxableIncome = grossIncome.subtract(TAX_FREE_THRESHOLD).subtract(insuranceDeduction);
            BigDecimal personalTax = BigDecimal.ZERO;
            if (taxableIncome.compareTo(BigDecimal.ZERO) > 0) {
                personalTax = taxableIncome.multiply(new BigDecimal("0.05")).setScale(0, RoundingMode.HALF_UP);
            }

            // 4. Thực lĩnh cuối cùng
            BigDecimal net = grossIncome.subtract(insuranceDeduction).subtract(personalTax).setScale(0, RoundingMode.HALF_UP);

            // Gán giá trị vào thực thể để lưu xuống DB
            p.setLuongCoBan(baseSalary);
            p.setPhuCap(teachingAllowance);
            p.setBhxhKhauTru(insuranceDeduction);
            p.setThueTncn(personalTax);
            p.setThucLinh(net);

            payrollList.add(p);
        }

        if (payrollList.isEmpty()) {
            throw new RuntimeException("Dữ liệu chấm công tháng " + month + " trống. Không thể tính lương!");
        }

        return payrollList;
    }
}