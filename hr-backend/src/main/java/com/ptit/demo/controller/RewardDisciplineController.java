package com.ptit.demo.controller;

import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.RewardDiscipline;
import com.ptit.demo.repository.EmployeeRepository;
import com.ptit.demo.repository.RewardDisciplineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
@CrossOrigin("*")
public class RewardDisciplineController {

    @Autowired
    private RewardDisciplineRepository rdRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<List<RewardDiscipline>> getAll() {
        return ResponseEntity.ok(rdRepository.findAll());
    }

    @GetMapping("/my-records/{employeeId}")
    public ResponseEntity<List<RewardDiscipline>> getMyRecords(@PathVariable Long employeeId) {
        return ResponseEntity.ok(rdRepository.findByEmployeeId(employeeId));
    }

    @PostMapping
    public ResponseEntity<?> createRecord(@RequestBody Map<String, Object> payload) {
        try {
            Long employeeId = Long.parseLong(payload.get("employeeId").toString());
            String type = payload.get("type").toString();
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            String reason = payload.get("reason") != null ? payload.get("reason").toString() : "";
            LocalDate effectiveDate = LocalDate.parse(payload.get("effectiveDate").toString());

            Employee emp = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

            RewardDiscipline rd = new RewardDiscipline();
            rd.setEmployee(emp);
            rd.setType(type);
            rd.setAmount(amount);
            rd.setReason(reason);
            rd.setEffectiveDate(effectiveDate);

            rdRepository.save(rd);
            return ResponseEntity.ok(Map.of("message", "Đã thêm quyết định thành công!", "record", rd));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        rdRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
    }
}
