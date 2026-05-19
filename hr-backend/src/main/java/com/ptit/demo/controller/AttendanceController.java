package com.ptit.demo.controller;

import com.ptit.demo.entity.Attendance;
import com.ptit.demo.repository.AttendanceRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin("*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

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

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    String empIdStr = formatter.formatCellValue(row.getCell(0)).trim();
                    if (empIdStr.isEmpty()) continue;

                    Attendance a = new Attendance();
                    a.setEmployeeId((long) Double.parseDouble(empIdStr));
                    a.setNgayCham(parseDate(row.getCell(1), formatter));
                    a.setGioVao(parseTime(row.getCell(2), formatter));
                    a.setTrangThai(formatter.formatCellValue(row.getCell(3)).trim());

                    String tietStr = formatter.formatCellValue(row.getCell(4)).trim();
                    a.setSoTietDay(tietStr.isEmpty() ? 0 : (int) Double.parseDouble(tietStr));

                    a.setCoDiLam(true);
                    attendances.add(a);
                    successCount++;
                } catch (Exception rowEx) {
                    System.out.println("Lỗi dữ liệu ở dòng Excel số " + (i + 1) + ": " + rowEx.getMessage());
                    errorCount++;
                }
            }

            if (attendances.isEmpty()) {
                return ResponseEntity.badRequest().body("Không đọc được dữ liệu hợp lệ! Vui lòng kiểm tra định dạng.");
            }

            attendanceRepository.saveAll(attendances);
            return ResponseEntity.ok(Map.of("message", "Upload thành công " + successCount + " dòng. Bỏ qua " + errorCount + " dòng lỗi."));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
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