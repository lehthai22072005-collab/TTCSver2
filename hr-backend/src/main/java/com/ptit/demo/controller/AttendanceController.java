package com.ptit.demo.controller;

import com.ptit.demo.entity.Attendance;
import com.ptit.demo.repository.AttendanceRepository;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.PayrollRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin("*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    // 1. LẤY TẤT CẢ
    @GetMapping("/all")
    public ResponseEntity<?> getAllAttendance() {
        List<Attendance> list = attendanceRepository.findAll();

        List<Map<String, Object>> response = list.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("employeeId", a.getEmployeeId());
            map.put("employeeName", a.getEmployee() != null ? a.getEmployee().getFullName() : "Chưa xác định");
            map.put("ngayCham", a.getNgayCham());
            map.put("gioVao", a.getGioVao());
            map.put("trangThai", a.getTrangThai());
            map.put("soTietDay", a.getSoTietDay());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // 2. LẤY CÁ NHÂN
    @GetMapping("/employee/{empId}")
    public ResponseEntity<?> getAttendanceByEmployee(@PathVariable Long empId) {
        List<Attendance> list = attendanceRepository.findByEmployeeId(empId);

        List<Map<String, Object>> response = list.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("ngayCham", a.getNgayCham());
            map.put("gioVao", a.getGioVao());
            map.put("trangThai", a.getTrangThai());
            map.put("soTietDay", a.getSoTietDay());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // 3. UPLOAD EXCEL
    @PostMapping("/upload")
    @Transactional
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File Excel đang trống!");
        }

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            List<Attendance> attendances = new ArrayList<>();
            DataFormatter formatter = new DataFormatter();

            int successCount = 0;
            int errorCount = 0;
            Set<YearMonth> uploadedMonths = new HashSet<>();
            Set<String> employeeDates = new HashSet<>();
            List<String> rowErrors = new ArrayList<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    String empIdStr = formatter.formatCellValue(row.getCell(0)).trim();
                    if (empIdStr.isEmpty()) continue;

                    Attendance a = new Attendance();
                    long employeeId = (long) Double.parseDouble(empIdStr);
                    if (!employeeRepository.existsById(employeeId)) {
                        throw new RuntimeException("Không tồn tại nhân viên ID " + employeeId);
                    }

                    LocalDate attendanceDate = parseDate(row.getCell(1), formatter);
                    String employeeDateKey = employeeId + "|" + attendanceDate;
                    if (!employeeDates.add(employeeDateKey)) {
                        throw new RuntimeException("Trùng nhân viên và ngày chấm công");
                    }

                    a.setEmployeeId(employeeId);
                    a.setNgayCham(attendanceDate);
                    a.setGioVao(parseTime(row.getCell(2), formatter));
                    a.setTrangThai(formatter.formatCellValue(row.getCell(3)).trim());

                    String tietStr = formatter.formatCellValue(row.getCell(4)).trim();
                    a.setSoTietDay(tietStr.isEmpty() ? 0 : (int) Double.parseDouble(tietStr));

                    a.setCoDiLam(true);
                    attendances.add(a);
                    uploadedMonths.add(YearMonth.from(attendanceDate));
                    successCount++;
                } catch (Exception rowEx) {
                    rowErrors.add("Dòng " + (i + 1) + ": " + rowEx.getMessage());
                    errorCount++;
                }
            }

            if (errorCount > 0) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "File có " + errorCount + " dòng lỗi. Không có dữ liệu nào được lưu.",
                        "errors", rowErrors
                ));
            }

            if (attendances.isEmpty()) {
                return ResponseEntity.badRequest().body("Không đọc được dữ liệu hợp lệ! Vui lòng kiểm tra định dạng.");
            }

            if (uploadedMonths.size() != 1) {
                return ResponseEntity.badRequest().body("Mỗi file chỉ được chứa dữ liệu của đúng một tháng.");
            }

            YearMonth uploadedMonth = uploadedMonths.iterator().next();
            String salaryMonth = uploadedMonth.format(DateTimeFormatter.ofPattern("MM/yyyy"));
            if (payrollRepository.existsByThangNamAndTrangThaiChotTrue(salaryMonth)) {
                return ResponseEntity.badRequest().body(
                        "Tháng " + salaryMonth + " đã chốt lương nên không thể upload lại chấm công."
                );
            }

            LocalDate startDate = uploadedMonth.atDay(1);
            LocalDate endDate = uploadedMonth.atEndOfMonth();
            long replacedCount = attendanceRepository.countByNgayChamBetween(startDate, endDate);

            attendanceRepository.deleteByNgayChamBetween(startDate, endDate);
            payrollRepository.deleteByThangNamAndTrangThaiChotFalse(salaryMonth);
            attendanceRepository.saveAll(attendances);
            return ResponseEntity.ok(Map.of(
                    "message", "Upload thành công " + successCount + " dòng cho tháng " + salaryMonth
                            + ". Đã thay thế " + replacedCount + " dòng cũ.",
                    "month", salaryMonth,
                    "uploadedRows", successCount,
                    "replacedRows", replacedCount
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @GetMapping("/month-status")
    public ResponseEntity<?> getMonthStatus(@RequestParam String month) {
        try {
            YearMonth yearMonth = YearMonth.parse(month, DateTimeFormatter.ofPattern("MM/yyyy"));
            long rowCount = attendanceRepository.countByNgayChamBetween(
                    yearMonth.atDay(1),
                    yearMonth.atEndOfMonth()
            );
            return ResponseEntity.ok(Map.of(
                    "month", month,
                    "uploaded", rowCount > 0,
                    "rowCount", rowCount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Kỳ chấm công không hợp lệ."));
        }
    }

    // --- HÀM TRỊ LỖI NGÀY THÁNG EXCEL (BẢN TỐI THƯỢNG - BAO THẦU MỌI ĐỊNH DẠNG) ---
    private LocalDate parseDate(Cell cell, DataFormatter formatter) {
        if (cell == null) throw new RuntimeException("Ô ngày trống");

        // Nếu Excel lưu dạng số ngầm định
        if (cell.getCellType() == CellType.NUMERIC) {
            return DateUtil.getLocalDateTime(cell.getNumericCellValue()).toLocalDate();
        }

        // Nếu Excel lưu dạng chữ Text
        String val = formatter.formatCellValue(cell).trim();
        try {
            // 1. Chuẩn Quốc tế: yyyy-MM-dd
            if (val.contains("-") && val.indexOf("-") == 4) {
                return LocalDate.parse(val);
            }
            // 2. Chuẩn Việt Nam: dd/MM/yyyy
            else if (val.contains("/")) {
                java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
                return LocalDate.parse(val, dtf);
            }
            // 3. Chuẩn Việt Nam dùng gạch ngang: dd-MM-yyyy
            else if (val.contains("-") && val.indexOf("-") == 2) {
                java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy");
                return LocalDate.parse(val, dtf);
            }
            // 4. Nếu là số Serial kiểu Text (VD: "46113")
            else {
                return DateUtil.getLocalDateTime(Double.parseDouble(val)).toLocalDate();
            }
        } catch (Exception e) {
            throw new RuntimeException("Định dạng ngày không hợp lệ: " + val);
        }
    }

    // --- HÀM TRỊ LỖI GIỜ EXCEL ---
    private LocalTime parseTime(Cell cell, DataFormatter formatter) {
        if (cell == null) throw new RuntimeException("Ô giờ trống");
        if (cell.getCellType() == CellType.NUMERIC) {
            return DateUtil.getLocalDateTime(cell.getNumericCellValue()).toLocalTime();
        }
        String val = formatter.formatCellValue(cell).trim();
        try {
            if (val.length() == 5) val += ":00"; // Đắp thêm giây nếu thiếu (07:45 -> 07:45:00)
            return LocalTime.parse(val);
        } catch (Exception e) {
            return DateUtil.getLocalDateTime(Double.parseDouble(val)).toLocalTime();
        }
    }
}
