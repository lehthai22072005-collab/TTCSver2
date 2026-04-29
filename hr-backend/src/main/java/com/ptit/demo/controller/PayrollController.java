package com.ptit.demo.controller;

import com.ptit.demo.entity.Payroll;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.PayrollRepository;
import com.ptit.demo.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    /**
     * 1. Lấy dữ liệu nháp (Preview)
     * Ưu tiên lấy dữ liệu từ Database nếu bạn đã INSERT thủ công.
     */
    @GetMapping("/preview")
    public ResponseEntity<?> previewSalary(@RequestParam String month) {
        // KIỂM TRA 1: Nếu tháng này đã chốt chính thức (trang_thai_chot = 1) thì khóa luôn
        if (payrollRepository.existsByThangNamAndTrangThaiChotTrue(month)) {
            return ResponseEntity.badRequest().body("Tháng " + month + " đã được chốt lương chính thức. Không thể tính lại!");
        }

        // KIỂM TRA 2: Tìm xem trong DB đã có dữ liệu nháp (bạn đã INSERT thủ công) chưa
        List<Payroll> existingDrafts = payrollRepository.findByThangNam(month);

        // Nếu ĐÃ CÓ dữ liệu trong SQL, trả về luôn để hiển thị số bạn đã nhập (15tr, 30tr...)
        if (!existingDrafts.isEmpty()) {
            System.out.println("===> Log: Tìm thấy dữ liệu SQL thủ công cho tháng " + month + ". Hiển thị lên Web.");
            return ResponseEntity.ok(existingDrafts);
        }

        // Nếu CHƯA CÓ gì cả, lúc này mới gọi Service để tính toán mẫu theo logic mặc định
        System.out.println("===> Log: DB trống, đang tạo dữ liệu mẫu tự động...");
        var employees = employeeRepository.findAll();
        List<Payroll> payrollList = payrollService.calculateForAll(month, employees);

        // Lưu bản tính mẫu này vào DB để lần sau nhấn nút sẽ load từ đây ra (không tính lại nữa)
        payrollRepository.saveAll(payrollList);

        return ResponseEntity.ok(payrollList);
    }

    /**
     * 2. Chốt lương (Lock)
     * Chuyển trạng thái từ nháp (0) sang chốt (1)
     */
    @PostMapping("/lock")
    public ResponseEntity<?> lockSalary(@RequestParam String month) {
        // Kiểm tra xem tháng này đã chốt từ trước chưa
        if (payrollRepository.existsByThangNamAndTrangThaiChotTrue(month)) {
            return ResponseEntity.badRequest().body("Tháng " + month + " đã được chốt trước đó rồi!");
        }

        // Lấy danh sách nháp hiện có
        List<Payroll> payrolls = payrollRepository.findByThangNam(month);
        if (payrolls.isEmpty()) {
            return ResponseEntity.status(404).body("Không tìm thấy dữ liệu để chốt!");
        }

        // Cập nhật trạng thái
        payrolls.forEach(p -> {
            p.setTrangThaiChot(true);
            p.setNgayChot(LocalDateTime.now());
        });

        payrollRepository.saveAll(payrolls);
        return ResponseEntity.ok(Map.of("message", "Chốt lương tháng " + month + " thành công!"));
    }

    /**
     * 3. Lấy lịch sử chi trả
     */
    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory() {
        return ResponseEntity.ok(payrollRepository.findByTrangThaiChotTrue());
    }

    /**
     * 4. Lấy chi tiết lương cho trang chi tiết
     */
    @GetMapping("/detail")
    public ResponseEntity<?> getPaymentDetail(@RequestParam String month) {
        List<Payroll> details = payrollRepository.findByThangNam(month);
        return ResponseEntity.ok(details);
    }
}