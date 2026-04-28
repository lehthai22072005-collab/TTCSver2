package com.ptit.demo.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PayrollService {
    // Tỷ lệ đóng BHXH 10.5% (Theo UC-014 trong tài liệu)
    private static final BigDecimal BHXH_RATE = new BigDecimal("0.105");

    // Mức giảm trừ gia cảnh (11 triệu VNĐ)
    private static final BigDecimal TAX_FREE_THRESHOLD = new BigDecimal("11000000");

    public BigDecimal calculateNetSalary(BigDecimal baseSalary, int totalPeriods, BigDecimal pricePerPeriod) {
        // 1. Tính phụ cấp tiết dạy (REQ-PAY-001)
        BigDecimal teachingAllowance = pricePerPeriod.multiply(new BigDecimal(totalPeriods));

        // 2. Tính bảo hiểm (UC-014)
        BigDecimal insuranceDeduction = baseSalary.multiply(BHXH_RATE);

        // 3. Tính thuế TNCN (UC-014)
        BigDecimal grossIncome = baseSalary.add(teachingAllowance);
        BigDecimal taxableIncome = grossIncome.subtract(TAX_FREE_THRESHOLD).subtract(insuranceDeduction);

        BigDecimal personalTax = BigDecimal.ZERO;
        if (taxableIncome.compareTo(BigDecimal.ZERO) > 0) {
            personalTax = taxableIncome.multiply(new BigDecimal("0.05"));
        }

        // 4. Thực lĩnh (Net Salary)
        return grossIncome.subtract(insuranceDeduction).subtract(personalTax).setScale(0, RoundingMode.HALF_UP);
    }
}