package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.KpiEvaluation;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.KpiEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kpi")
@CrossOrigin("*")
public class KpiEvaluationController {

    @Autowired
    private KpiEvaluationRepository kpiRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<List<KpiEvaluation>> getAllKpi() {
        return ResponseEntity.ok(kpiRepository.findAll());
    }

    @GetMapping("/my-kpi/{employeeId}")
    public ResponseEntity<List<KpiEvaluation>> getMyKpi(@PathVariable Long employeeId) {
        return ResponseEntity.ok(kpiRepository.findByEmployeeId(employeeId));
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateKpi(@RequestBody Map<String, Object> payload) {
        try {
            Long id = payload.get("id") != null ? Long.parseLong(payload.get("id").toString()) : null;
            Long employeeId = Long.parseLong(payload.get("employeeId").toString());
            String hocKy = payload.get("hocKy").toString();
            java.math.BigDecimal diemDanhGia = new java.math.BigDecimal(payload.get("diemDanhGia").toString());
            Integer soBaiBao = Integer.parseInt(payload.get("soBaiBao").toString());
            String ghiChu = payload.get("ghiChu") != null ? payload.get("ghiChu").toString() : "";

            // Tự động tính xếp loại
            String xepLoai = "Chưa đạt";
            if (diemDanhGia.compareTo(new java.math.BigDecimal("8.5")) >= 0 && soBaiBao >= 2) {
                xepLoai = "Xuất sắc";
            } else if (diemDanhGia.compareTo(new java.math.BigDecimal("7.0")) >= 0 && soBaiBao >= 1) {
                xepLoai = "Hoàn thành tốt";
            } else if (diemDanhGia.compareTo(new java.math.BigDecimal("5.0")) >= 0) {
                xepLoai = "Hoàn thành nhiệm vụ";
            }

            KpiEvaluation kpi;
            if (id != null) {
                kpi = kpiRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy KPI"));
            } else {
                kpi = new KpiEvaluation();
                Employee emp = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Không tìm thấy NV"));
                kpi.setEmployee(emp);
            }

            kpi.setHocKy(hocKy);
            kpi.setDiemDanhGia(diemDanhGia);
            kpi.setSoBaiBao(soBaiBao);
            kpi.setXepLoai(xepLoai);
            kpi.setGhiChu(ghiChu);

            kpiRepository.save(kpi);

            return ResponseEntity.ok(Map.of("message", "Lưu KPI thành công!", "kpi", kpi));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKpi(@PathVariable Long id) {
        kpiRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
    }
}
