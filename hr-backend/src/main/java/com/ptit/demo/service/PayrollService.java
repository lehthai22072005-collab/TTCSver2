package com.ptit.demo.service;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.Payroll;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.repository.RewardDisciplineRepository;
import com.ptit.demo.entity.RewardDiscipline;
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

    @Autowired
    private RewardDisciplineRepository rdRepository;

    private static final BigDecimal BHXH_RATE = new BigDecimal("0.105");
    private static final BigDecimal TAX_FREE_THRESHOLD = new BigDecimal("11000000");
    private static final int STANDARD_TEACHING_PERIODS = 80;
    private static final BigDecimal OVERTIME_TEACHING_RATE = new BigDecimal("150000");

    public List<Payroll> calculateForAll(String month, List<Employee> employees) {
        List<Payroll> payrollList = new ArrayList<>();
        String[] parts = month.split("/");
        String monthPattern = parts[1] + "-" + parts[0] + "-%";

        for (Employee emp : employees) {
            int workDays = payrollRepository.countWorkDays(emp.getId(), monthPattern);
            Integer periodSum = payrollRepository.sumTeachingPeriods(emp.getId(), monthPattern);
            int totalTeachingPeriods = periodSum != null ? periodSum : 0;

            if (workDays == 0 && totalTeachingPeriods == 0) {
                continue;
            }

            Payroll p = new Payroll();
            p.setEmployee(emp);
            p.setThangNam(month);
            p.setTrangThaiChot(false);
            p.setNgayCong(workDays);

            BigDecimal baseSalary = (emp.getBaseSalary() != null) ? emp.getBaseSalary() : new BigDecimal("10000000");
            BigDecimal heSo = new BigDecimal(emp.getBacLuong() != null ? emp.getBacLuong() : 1);
            
            BigDecimal calculatedBaseSalary;
            BigDecimal teachingAllowance = BigDecimal.ZERO;
            int overtimeTeachingPeriods = 0;
            
            BigDecimal standardDays = new BigDecimal("22");
            BigDecimal actualDays = new BigDecimal(workDays);
            
            if (isTeacherGroup(emp.getNhomNhanSu())) {
                calculatedBaseSalary = baseSalary.multiply(actualDays).divide(standardDays, 0, RoundingMode.HALF_UP);
                overtimeTeachingPeriods = Math.max(totalTeachingPeriods - STANDARD_TEACHING_PERIODS, 0);
                teachingAllowance = OVERTIME_TEACHING_RATE.multiply(new BigDecimal(overtimeTeachingPeriods));
                heSo = BigDecimal.ONE;
            } else {
                // Cán bộ hành chính tính lương theo hệ số ngạch bậc và số ngày làm việc thực tế
                BigDecimal fullSalary = baseSalary.multiply(heSo);
                calculatedBaseSalary = fullSalary.multiply(actualDays).divide(standardDays, 0, RoundingMode.HALF_UP);
                teachingAllowance = BigDecimal.ZERO;
            }

            p.setHeSoLuong(heSo);
            p.setTienGiangDay(teachingAllowance);
            p.setTietDay(overtimeTeachingPeriods);

            // 2. Tính khấu trừ bảo hiểm xã hội (10.5% lương tính bảo hiểm)
            BigDecimal insuranceDeduction = calculatedBaseSalary.multiply(BHXH_RATE).setScale(0, RoundingMode.HALF_UP);

            // 3. Tính thuế thu nhập cá nhân (5% phần thu nhập tính thuế vượt ngưỡng 11 triệu)
            BigDecimal grossIncome = calculatedBaseSalary.add(teachingAllowance);
            BigDecimal taxableIncome = grossIncome.subtract(TAX_FREE_THRESHOLD).subtract(insuranceDeduction);
            BigDecimal personalTax = BigDecimal.ZERO;
            if (taxableIncome.compareTo(BigDecimal.ZERO) > 0) {
                personalTax = taxableIncome.multiply(new BigDecimal("0.05")).setScale(0, RoundingMode.HALF_UP);
            }

            // Query Thưởng Phạt trong tháng
            List<RewardDiscipline> rdList = rdRepository.findByEmployeeIdAndMonth(emp.getId(), month);
            BigDecimal totalThuong = BigDecimal.ZERO;
            BigDecimal totalPhat = BigDecimal.ZERO;

            for (RewardDiscipline rd : rdList) {
                if ("KHEN_THUONG".equals(rd.getType())) {
                    totalThuong = totalThuong.add(rd.getAmount());
                } else if ("KY_LUAT".equals(rd.getType())) {
                    totalPhat = totalPhat.add(rd.getAmount());
                }
            }

            p.setTienThuong(totalThuong);
            p.setTienPhat(totalPhat);

            // 4. Thực lĩnh cuối cùng (Cộng thưởng, Trừ phạt sau thuế)
            BigDecimal net = grossIncome.subtract(insuranceDeduction).subtract(personalTax).add(totalThuong).subtract(totalPhat).setScale(0, RoundingMode.HALF_UP);
            
            // Đảm bảo thực lĩnh không bao giờ âm
            net = net.max(BigDecimal.ZERO);

            // Gán giá trị vào thực thể để lưu xuống DB
            p.setLuongCoBan(calculatedBaseSalary);
            p.setPhuCap(BigDecimal.ZERO); // Nếu có phụ cấp khác thì cộng vào đây
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

    private boolean isTeacherGroup(String group) {
        if (group == null) {
            return false;
        }
        String normalized = group.trim().toLowerCase();
        return normalized.equals("giảng viên")
                || normalized.equals("giang vien")
                || normalized.contains("giảng")
                || normalized.contains("giang");
    }
}
