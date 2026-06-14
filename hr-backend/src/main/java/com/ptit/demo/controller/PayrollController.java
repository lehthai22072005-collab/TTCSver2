package com.ptit.demo.controller;

import com.ptit.demo.entity.Payroll;
import com.ptit.demo.entity.TeachingDeclaration;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.AttendanceRepository;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.repository.TeachingDeclarationRepository;
import com.ptit.demo.service.EmailService;
import com.ptit.demo.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/salary")
@CrossOrigin("*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TeachingDeclarationRepository declRepository;

    @GetMapping("/preview")
    public ResponseEntity<?> previewSalary(@RequestParam String month) {
        if (!hasAttendanceData(month)) {
            return ResponseEntity.badRequest().body(
                    "Tháng " + month + " chưa upload file chấm công."
            );
        }

        if (payrollRepository.existsByThangNamAndTrangThaiChotTrue(month)) {
            return ResponseEntity.badRequest().body("Tháng " + month + " đã được chốt lương. Không thể tính lại!");
        }

        try {
            var employees = employeeRepository.findAll();

            List<Payroll> payrollList = payrollService.calculateForAll(month, employees);

            payrollRepository.deleteByThangNamAndTrangThaiChotFalse(month);
            payrollRepository.saveAll(payrollList);

            return ResponseEntity.ok(payrollList);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/lock")
    public ResponseEntity<?> lockSalary(@RequestParam String month) {
        if (payrollRepository.existsByThangNamAndTrangThaiChotTrue(month)) {
            return ResponseEntity.badRequest().body("Tháng " + month + " đã chốt rồi!");
        }

        List<Payroll> payrolls = payrollRepository.findByThangNam(month);

        if (payrolls.isEmpty()) {
            return ResponseEntity.status(404).body("Không có dữ liệu nháp!");
        }

        payrolls.forEach(p -> {
            p.setTrangThaiChot(true);
            p.setNgayChot(LocalDateTime.now());
            
            List<TeachingDeclaration> declarations = declRepository.findValidUnpaidDeclarations(p.getEmployee().getId(), "ĐÃ DUYỆT");
            for (TeachingDeclaration d : declarations) {
                d.setIsPaid(true);
            }
            declRepository.saveAll(declarations);
        });

        payrollRepository.saveAll(payrolls);

        int sentCount = 0;
        int failedCount = 0;

        if (emailService.isEmailEnabled()) {
            for (Payroll payroll : payrolls) {
                try {
                    emailService.sendPayslipEmail(payroll);
                    sentCount++;
                } catch (Exception e) {
                    failedCount++;
                    System.out.println("Lỗi gửi phiếu lương cho ID bảng lương "
                            + payroll.getId() + ": " + e.getMessage());
                }
            }
        }

        String message = "Chốt lương thành công!";

        if (emailService.isEmailEnabled()) {
            message += " Đã gửi email phiếu lương: "
                    + sentCount + " thành công, "
                    + failedCount + " thất bại.";
        } else {
            message += " Chức năng email đang tắt nên chưa gửi phiếu lương.";
        }

        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory() {
        return ResponseEntity.ok(payrollRepository.findByTrangThaiChotTrue());
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getPaymentDetail(@RequestParam String month) {
        return ResponseEntity.ok(payrollRepository.findByThangNam(month));
    }

    @GetMapping("/my-salary/{empId}")
    public ResponseEntity<?> getMySalary(@PathVariable Long empId) {
        List<Payroll> myPayrolls = payrollRepository.findByEmployeeId(empId);
        return ResponseEntity.ok(myPayrolls);
    }

    @GetMapping("/export")
    public ResponseEntity<?> exportSalaryToExcel(@RequestParam String month) {
        if (!hasAttendanceData(month)) {
            return ResponseEntity.badRequest().body(
                    "Không thể xuất Excel vì tháng " + month + " chưa upload file chấm công."
            );
        }

        List<Payroll> payrolls = payrollRepository.findByThangNam(month);
        if (payrolls.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    "Vui lòng chạy tính lương tháng " + month + " trước khi xuất Excel."
            );
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Bảng lương tháng " + month.replace("/", "-"));

            // Create Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Mã NV", "Họ Tên", "Nhóm Nhân Sự", "Số Ngày Công", "Số Tiết Vượt Giờ", "Lương CB", "Hệ Số", "Tiền Giảng Dạy", "Bảo Hiểm", "Thuế TNCN", "Thưởng", "Phạt", "Thực Lĩnh"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            // Fill Data
            int rowIdx = 1;
            for (Payroll p : payrolls) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue("NV" + p.getEmployee().getId());
                row.createCell(1).setCellValue(p.getEmployee().getFullName());
                row.createCell(2).setCellValue(p.getEmployee().getDepartment());
                row.createCell(3).setCellValue(p.getNgayCong() != null ? p.getNgayCong() : 0);
                row.createCell(4).setCellValue(p.getTietDay() != null ? p.getTietDay() : 0);
                row.createCell(5).setCellValue(p.getLuongCoBan() != null ? p.getLuongCoBan().doubleValue() : 0);
                row.createCell(6).setCellValue(p.getHeSoLuong() != null ? p.getHeSoLuong().doubleValue() : 1.0);
                row.createCell(7).setCellValue(p.getTienGiangDay() != null ? p.getTienGiangDay().doubleValue() : 0);
                row.createCell(8).setCellValue(p.getBhxhKhauTru() != null ? p.getBhxhKhauTru().doubleValue() : 0);
                row.createCell(9).setCellValue(p.getThueTncn() != null ? p.getThueTncn().doubleValue() : 0);
                row.createCell(10).setCellValue(p.getTienThuong() != null ? p.getTienThuong().doubleValue() : 0);
                row.createCell(11).setCellValue(p.getTienPhat() != null ? p.getTienPhat().doubleValue() : 0);
                row.createCell(12).setCellValue(p.getThucLinh() != null ? p.getThucLinh().doubleValue() : 0);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            byte[] fileContent = out.toByteArray();

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            responseHeaders.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=BangLuong_" + month.replace("/", "_") + ".xlsx");

            return ResponseEntity.ok().headers(responseHeaders).body(fileContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private boolean hasAttendanceData(String month) {
        try {
            YearMonth yearMonth = YearMonth.parse(month, DateTimeFormatter.ofPattern("MM/yyyy"));
            return attendanceRepository.existsByNgayChamBetween(
                    yearMonth.atDay(1),
                    yearMonth.atEndOfMonth()
            );
        } catch (Exception e) {
            return false;
        }
    }
}
